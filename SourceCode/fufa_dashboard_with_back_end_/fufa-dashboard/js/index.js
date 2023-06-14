//global form 
var file
function trigger(event){
    const files = event.target.files[0];
     file=event.target.files[0];
    console.log(files);
}
const getLive=()=>{
    const formData=new FormData()
    formData.append("pack","live")
    //its a post request
    fetch('http://localhost:4000/getPackage', {
       method: 'POST',
body:JSON.stringify({
    pack:"jasho"
}),
headers:{
    
        "Content-Type": "application/json",
    
}
})
.then((response) => response.json())
.then((data) => {
    //map througg array
   const mapAll= data.all.map((v)=>{
       return `
       <div class="livestream-row">
        <div class="single-card">
        <div class="upper-aection">
            <img src=${v.data.video_thumbnail} alt="">
            <div class="icons">
                <i class="fa-regular fa-pen-to-square"></i>
                <i class="fa-solid fa-trash"></i>
                <i class="fa fa-exclamation-circle"></i>
            </div>
        </div>
        <div class="lower-section">
            <div class="tv-name">
            ${v.data.video_title}
            </div>
            <div class="lowest-div">
                <div> ${v.data.views} k watching</div>
                <div>2 Hrs ago</div>

            </div>
        </div>
        </div>
        `
    })
    document.getElementById('main').innerHTML=mapAll
console.log('Success:', data.all[0]);
})
.catch((error) => {
console.error('Error:', error.message);
});
}



//get all videos
const getAllVideos=()=>{

}

//get Admins
const getAllAdmins=()=>{
    fetch('http://localhost:4000/admins')
.then((response) => response.json())
.then((data) => {
   const res= data.adminDocs.map((v)=>{
        return `
				<tr>
                <td><div class="image">
                        <img src=${v.data.image} alt="Network Error">
                    </div></td>
                <td>${v.data.name}</td>
                <td>${v.data.email}</td>
                <td>anotherqw</td>
                <td>${v.data.role}</td>
                <td>${v.id}</td>
            </tr>
        `
    })

    document.getElementById("subscribers_table").innerHTML=res
console.log('Success:', data);
})
.catch((error) => {
console.error('Error:', error);
});
}
//submit admin
const submitAdmin=()=>{
    const fname=document.getElementById("fName").value
    const lname=document.getElementById("lName").value
    const pass=document.getElementById("pass").value
    const email=document.getElementById("email").value
    const role=document.getElementById("role").value
    
    console.log(fname+lname+pass+email+role)
    // const name=document.getElementById().value
    // const name=document.getElementById().value
    // const name=document.getElementById().value
    
    
}

