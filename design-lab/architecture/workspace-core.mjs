/**
 * LifeOS prototype domain core — no Firebase, no persistence, no user data.
 * Pure commands/selectors. Not a migrated or complete V2 domain implementation.
 * Folder/project IDs are immutable; display names are editable.
 */
const priorities=new Set(["alta","media","bassa","none"]);
const projectStatuses=new Set(["active","planning","archived"]);
const iso=/^\d{4}-\d{2}-\d{2}$/;
function check(cond,msg){if(!cond)throw new Error(msg)}
function requireText(value,field,max=180){check(typeof value==="string"&&value.trim().length>0&&value.trim().length<=max,"Invalid "+field);return value.trim()}
function dateOk(value){
 if(value===null)return true;
 if(typeof value!=="string"||!iso.test(value))return false;
 const [y,m,d]=value.split("-").map(Number);
 const parsed=new Date(Date.UTC(y,m-1,d));
 return parsed.getUTCFullYear()===y&&parsed.getUTCMonth()+1===m&&parsed.getUTCDate()===d;
}
function copy(entity){return {...entity}}
export function createWorkspaceState(seed={}) {
 const folders=(seed.folders||[]).map(copy),projects=(seed.projects||[]).map(copy),tasks=(seed.tasks||[]).map(copy);
 const unique=(items,name)=>check(new Set(items.map(x=>x.id)).size===items.length,"Duplicate "+name+" IDs");
 unique(folders,"folder");unique(projects,"project");unique(tasks,"task");
 for(const f of folders){requireText(f.id,"folder.id",100);requireText(f.name,"folder.name",80)}
 for(const p of projects){requireText(p.id,"project.id",100);requireText(p.name,"project.name",100);check(folders.some(f=>f.id===p.folderId),"Project has missing folder: "+p.id);check(projectStatuses.has(p.status),"Project invalid status: "+p.id)}
 for(const t of tasks)validateTask(t,projects);
 return {folders,projects,tasks};
}
function validateTask(t,projects){
 requireText(t.id,"task.id",100);requireText(t.title,"task.title");
 check(projects.some(p=>p.id===t.projectId),"Task has missing project: "+t.id);
 check(priorities.has(t.priority),"Task invalid priority: "+t.id);
 check(dateOk(t.dueDate),"Invalid task dueDate: "+t.id);
 check(typeof t.done==="boolean","Task done must be boolean: "+t.id);
}
export function foldersList(state){return state.folders.map(copy)}
export function projectsForFolder(state,folderId,{includeArchived=false}={}){
 return state.projects.filter(p=>p.folderId===folderId&&(includeArchived||p.status!=="archived")).map(copy);
}
export function tasksForProject(state,projectId){return state.tasks.filter(t=>t.projectId===projectId).map(copy)}
export function tasksForDate(state,date){check(dateOk(date)&&date!==null,"Invalid date");return state.tasks.filter(t=>t.dueDate===date).map(copy)}
export function tasksWithoutDate(state){return state.tasks.filter(t=>t.dueDate===null).map(copy)}
export function projectCompletion(state,projectId){
 const ts=tasksForProject(state,projectId);const done=ts.filter(t=>t.done).length;
 return {total:ts.length,done,pct:ts.length?Math.round(done/ts.length*100):null};
}
export function applyWorkspaceCommand(state,command){
 check(command&&typeof command.type==="string","Invalid command");
 const draft={folders:state.folders.map(copy),projects:state.projects.map(copy),tasks:state.tasks.map(copy)};
 const hasFolder=id=>draft.folders.some(x=>x.id===id);
 const hasProject=id=>draft.projects.some(x=>x.id===id);
 const byId=(arr,id,domain)=>{const x=arr.find(x=>x.id===id);check(Boolean(x),"Unknown "+domain+": "+String(id));return x};
 switch(command.type){
 case "folder.create":{
  const id=requireText(command.id,"folder.id",100),name=requireText(command.name,"folder.name",80);
  check(!hasFolder(id),"Folder ID already used");
  check(!draft.folders.some(f=>f.name.toLocaleLowerCase("it")===name.toLocaleLowerCase("it")),"Folder name already used");
  draft.folders.push({id,name});break;
 }
 case "folder.rename":{
  const f=byId(draft.folders,command.id,"folder"),name=requireText(command.name,"folder.name",80);
  check(!draft.folders.some(x=>x.id!==f.id&&x.name.toLocaleLowerCase("it")===name.toLocaleLowerCase("it")),"Folder name already used");
  f.name=name;break;
 }
 case "folder.reorder":{
  const f=byId(draft.folders,command.id,"folder"),i=draft.folders.indexOf(f),j=Number(command.index);
  check(Number.isInteger(j)&&j>=0&&j<draft.folders.length,"Invalid folder index");
  draft.folders.splice(i,1);draft.folders.splice(j,0,f);break;
 }
 case "folder.delete":{
  const f=byId(draft.folders,command.id,"folder");
  check(!draft.projects.some(p=>p.folderId===f.id),"Cannot delete nonempty folder");
  draft.folders=draft.folders.filter(x=>x.id!==f.id);break;
 }
 case "project.create":{
  const id=requireText(command.id,"project.id",100),name=requireText(command.name,"project.name",100);
  check(!hasProject(id),"Project ID already used");check(hasFolder(command.folderId),"Missing target folder");
  const status=command.status||"active";check(projectStatuses.has(status),"Invalid project status");
  draft.projects.push({id,name,folderId:command.folderId,status});break;
 }
 case "project.move":{
  const p=byId(draft.projects,command.id,"project");check(hasFolder(command.folderId),"Missing target folder");p.folderId=command.folderId;break;
 }
 case "project.archive":{
  const p=byId(draft.projects,command.id,"project");p.status=command.archived?"archived":"active";break;
 }
 case "task.create":{
  const t={id:command.id,title:command.title,projectId:command.projectId,dueDate:command.dueDate??null,priority:command.priority||"none",done:false};
  check(!draft.tasks.some(x=>x.id===t.id),"Task ID already used");
  validateTask(t,draft.projects);draft.tasks.push(t);break;
 }
 case "task.update":{
  const t=byId(draft.tasks,command.id,"task");
  for(const key of ["title","projectId","dueDate","priority"]){if(Object.hasOwn(command,key))t[key]=command[key]}
  validateTask(t,draft.projects);break;
 }
 case "task.complete":{
  const t=byId(draft.tasks,command.id,"task");check(typeof command.done==="boolean","Invalid completion value");t.done=command.done;break;
 }
 default:throw new Error("Unsupported command: "+command.type);
 }
 return createWorkspaceState(draft);
}
