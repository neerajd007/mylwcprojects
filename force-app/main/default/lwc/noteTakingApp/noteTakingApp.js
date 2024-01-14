import { LightningElement,wire } from 'lwc';
import createNoteRecord from '@salesforce/apex/NoteTakingController.createNoteRecord';
import getNotes from '@salesforce/apex/NoteTakingController.getNotes';
import updateNoteRecord from '@salesforce/apex/NoteTakingController.updateNoteRecord';
import {refreshApex} from "@salesforce/apex";
import deleteNoteRecord from '@salesforce/apex/NoteTakingController.deleteNoteRecord';
import LightningConfirm from "lightning/confirm";


const DEFAULT_NOTE_FORM = {
    Name: "",
    Note_Description__c:""
}

export default class NoteTakingApp extends LightningElement{
    showModal=false;
    noteRecord = DEFAULT_NOTE_FORM;
    selectedRecordid;
    wiredResult;
    noteList=[]
    formats = [
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'indent',
        'align',
        'link',
        'clean',
        'table',
        'header',
        'color',
    ];

    get isFormInvalid(){
        return !(this.noteRecord && this.noteRecord.Note_Description__c && this.noteRecord.Name)
    }

    get actionHeaderName(){
        return this.selectedRecordid ? "Update Note":"Add Note"
    }

    @wire(getNotes)
    noteListInfo(result){
       this.wiredResult = result
       const {data,error} = result; 
        if(data){
            console.log("data of notes", JSON.stringify(data));
            this.noteList = data.map(item=>{
                let formatedDate = new Date(item.LastModifiedDate).toDateString();
                return {...item,formatedDate}
            })
        }
        if(error){
            console.log("error in fetching",error);
            this.showToastMsg(error.message.body, 'error')
        }
    }
    
    createNoteHandler(){
        this.showModal=true;
        //this.selectedRecordid = null;
    }

    closeModalHandler(){
        this.showModal=false;
        this.noteRecord = DEFAULT_NOTE_FORM;
        this.selectedRecordid=null;
    }

    changeHandler(event){
        const {name,value} = event.target
        this.noteRecord = {...this.noteRecord, [name]:value}
    }

    formSubmitHandler(event){
        event.preventDefault()
        console.log("this.noteRecord",JSON.stringify(this.noteRecord));
        if(this.selectedRecordid){
            this.updateNote(this.selectedRecordid);
        } else{
            this.createNote();
        }
        
        
    }

    createNote(){
        createNoteRecord({title:this.noteRecord.Name, description:this.noteRecord.Note_Description__c}).then(()=>{
            this.showModal=false;
            this.selectedRecordid = null;
            this.showToastMsg("Note created successfully!","success");
            this.refresh();
        }).catch(error=>{
            console.error("error",error.message.body);
            this.showToastMsg(error.message.body,"error");
        })
    }

    showToastMsg(message,variant){
        const elem = this.template.querySelector('c-notification')
        if(elem){
            elem.showToast(message,variant);
        }
    }

    editNoteHandler(event){
       const {recordid} = event.target.dataset;
       const noteRecord = this.noteList.find(item=>item.Id === recordid)
       this.noteRecord = {
        Name:noteRecord.Name,
        Note_Description__c:noteRecord.Note_Description__c
       }
       this.selectedRecordid = recordid;
       this.showModal=true;
    }

    updateNote(noteId){
        const {Name, Note_Description__c} = this.noteRecord;
        updateNoteRecord({"noteId":noteId,"title":Name,"description":Note_Description__c}).then(()=>{
            this.showModal=false;
            this.selectedRecordid = null;
            this.showToastMsg("Note updated successfully!","success");
            this.refresh();
        }).catch(error=>{
            console.error("error occurred while updating the note record",error);
            this.showToastMsg(error.message.body,"error");
        })
    }


    refresh(){
        return refreshApex(this.wiredResult);
    }

    deleteNoteHandler(event){
        this.selectedRecordid = event.target.dataset.recordid;
        this.handleConfirm()
    }

    async handleConfirm(){
        const result = await LightningConfirm.open({
            message:"Are you sure you want to delete this note?",
            variant:"headerless",
            label:"Delete Confirmation"
        })
        if(result){
            this.deleteHandler();
        } else{
            this.selectedRecordid=null
        }
    }

    deleteHandler(){
        deleteNoteRecord({noteId: this.selectedRecordid}).then(()=>{
            this.showModal=false;
            this.selectedRecordid=null
            this.showToastMsg("Note deleted successfully!","success")
            this.refresh();
        }).catch(error=>{
            console.error("Error occurred while deleting the note",error)
            this.showToastMsg(error.message.body, 'error');
        })
    }


}