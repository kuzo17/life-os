import {createWorkspaceState,applyWorkspaceCommand,projectsForFolder,tasksForProject,tasksForDate,projectCompletion} from "./workspace-core.mjs";
function assert(x,m){if(!x)throw Error("FAIL "+m)}
function mustFail(fn,m){let failed=false;try{fn()}catch(e){failed=true}assert(failed,m)}
const initial=createWorkspaceState({folders:[{id:"a",name:"Original"},{id:"b",name:"Altro"}],projects:[{id:"p",name:"Libro",folderId:"a",status:"active"}],tasks:[{id:"t",title:"Revisionare",projectId:"p",priority:"alta",dueDate:"2026-10-19",done:false}]});
let next=applyWorkspaceCommand(initial,{type:"folder.rename",id:"a",name:"Rinominata"});
assert(initial.folders[0].name==="Original","original immutable");
assert(projectsForFolder(next,"a").length===1,"folder link survives rename");
next=applyWorkspaceCommand(next,{type:"project.move",id:"p",folderId:"b"});
assert(projectsForFolder(next,"b").length===1,"project moved");
assert(tasksForProject(next,"p").length===1,"task link stable");
next=applyWorkspaceCommand(next,{type:"task.update",id:"t",dueDate:"2026-10-20"});
assert(tasksForDate(next,"2026-10-19").length===0&&tasksForDate(next,"2026-10-20").length===1,"task date selector");
next=applyWorkspaceCommand(next,{type:"task.complete",id:"t",done:true});
assert(projectCompletion(next,"p").pct===100&&projectCompletion(initial,"p").pct===0,"derived completion");
next=applyWorkspaceCommand(next,{type:"project.archive",id:"p",archived:true});
assert(projectsForFolder(next,"b").length===0&&projectsForFolder(next,"b",{includeArchived:true}).length===1,"archive preserves project");
assert(tasksForProject(next,"p").length===1,"archive preserves linked task");
mustFail(()=>applyWorkspaceCommand(next,{type:"folder.delete",id:"b"}),"occupied folder protected");
mustFail(()=>applyWorkspaceCommand(next,{type:"task.update",id:"t",dueDate:"2026-02-30"}),"invalid ISO date");
mustFail(()=>applyWorkspaceCommand(next,{type:"task.update",id:"t",projectId:"missing"}),"orphan project rejected");
mustFail(()=>applyWorkspaceCommand(next,{type:"task.create",id:"t",title:"Duplicate",projectId:"p"}),"duplicate task rejected");
mustFail(()=>applyWorkspaceCommand(next,{type:"folder.create",id:"c",name:"Rinominata"}),"duplicate folder name rejected");
console.log("workspace-core invariants PASS: 13 checks");
