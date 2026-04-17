const fs=require('fs');
const path=require('path');

const dataPath=path.join(__dirname,'../data/posts.json');
const userPath=path.join(__dirname,'../data/users.json');

//get post functions
const getPost=()=>{
    const fileData=fs.readFileSync(dataPath,'utf-8');
    return JSON.parse(fileData);
};

const savePost=(post)=>{
    const currenntPost=getPost();
    currenntPost.push(post);

    fs.writeFileSync(dataPath,JSON.stringify(currenntPost,null,2));
};

//get user functions 
const getUser=()=>{
    const fileData=fs.readFileSync(userPath,'utf-8');
    return JSON.parse(fileData);
};

const saveUser=(user)=>{
    const currentUser=getUser();
    currentUser.push(user);
    fs.writeFileSync(userPath, JSON.stringify(currentUser,null,2));

};

module.exports={getPost,savePost,getUser,saveUser}