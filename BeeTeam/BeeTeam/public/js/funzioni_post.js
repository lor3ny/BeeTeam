
import { getDoc,getFirestore,updateDoc,arrayUnion,doc , increment,deleteDoc,arrayRemove} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";

    const firebaseConfig = {
        apiKey: "AIzaSyA0PdI6RRM_VqyxEsUYuPe0Gu_TUrbbuuQ",
        authDomain: "beeteam-2a5f7.firebaseapp.com",
        databaseURL: "https://beeteam-2a5f7-default-rtdb.firebaseio.com",
        projectId: "beeteam-2a5f7",
        storageBucket: "beeteam-2a5f7.appspot.com",
        messagingSenderId: "223479016271",
        appId: "1:223479016271:web:383e9319470cfaf4bd733a",
        measurementId: "G-04ERX78GQJ"
    };

    // Initialize Firebase
    const app= initializeApp(firebaseConfig);
    const fire=getFirestore(app);
    const database=getDatabase(app);

    //Post
    export function createElem(id,text,parent){
        var cat=document.createElement("div");
        cat.setAttribute("class","row-mb-1");
        cat.setAttribute("id","cat"+id);
        cat.setAttribute("style"," color: #ffbf00c1")
        cat.innerHTML=text;
        parent.appendChild(cat);
        }
    //bacheca
    export function post_bacheca(id,parent,categoria,numero_persone,check,descrizione,user,sub){
        const c=document.createElement("div");
        c.setAttribute("id",id);
        c.setAttribute("class","box-activity");

        const space=document.createElement("div");
        space.setAttribute("class","mb-1");

        createElem("cat"+id,"<h3><b>"+ categoria +"</b></h3>",c);
        c.appendChild(space);
        createElem("hr"+id, "<hr>", c)
        c.appendChild(space)
        if(!check) createElem("user"+id," <h3><b> created by </b>"+ user +"</h3>",c);
        else createElem("user"+id,"<h3><b> Anonymous </b></h3><br>",c);
        c.appendChild(space)
        createElem("descrizione"+id, "<h4>"+descrizione+"</h4>", c);
        c.appendChild(space);
        //modifica anche qui
        createElem("nump"+id, "<h3><b>Available Places</b></h3>" + "<h4>"+sub+" / "+numero_persone+"</h4>",c);

        var button=document.createElement("a");
        button.setAttribute("style","text-align:center");
        button.innerText="SUB";
        button.setAttribute("style","color:white");
        c.appendChild(button);
        
        button.addEventListener('click',function(){loadInfoSub(id)})

        parent.appendChild(c);
        return c;   
    }
    //pressione del load e aggiornamento delle caselle relative a post e utente
    function loadInfoSub(key){
        var CurrentUser=getUser();
        var bool=false;
        try{
            var value=true;
            const docRef=doc(fire,"post",key);
            getDoc(docRef).then((snapref)=>{
                if(snapref.data().sub_restanti==0) value=false;
                else if(snapref.data().sub.includes(CurrentUser.user)){
                    value=false;
                    alert("Already subscribed!");
                }
            })
        if(value){
            const docRef = doc(fire, "post",key);
            getDoc(docRef).then((item) =>{
                var sub_restanti= item.data().sub_restanti;
                if(sub_restanti-1==0)  bool=true;

            })
        updateDoc(doc(fire, "users", CurrentUser.user), {
            aderiti: arrayUnion(key),
            complete:bool,
        });

        updateDoc(doc(fire, "post", key), {
            sub_restanti: increment(-1),
            sub: arrayUnion(CurrentUser.email)
        });
        alert("Success!");
        };
        }
        catch(e){
            alert(e);
        }
        }

        //post creati in profilo

    export function post_creati(id,parent,categoria,numero_persone,descrizione,sub ){
        var c=document.createElement("div");
        c.setAttribute("id",id);
        c.setAttribute("class","box-activity");

        const space=document.createElement("div");
        space.setAttribute("class","mb-1");
        
        const dele =document.createElement("img");
        dele.setAttribute("width","5%");
        dele.setAttribute("style","border-radius:30%;");
        dele.setAttribute("src","./css_pages/images/rubbish.jpg");
        c.appendChild(dele);
        c.appendChild(space);
        c.appendChild(space);

        dele.addEventListener('click',function(){onDelete(id,parent,c)});


        createElem("cat"+id,"<h3>"+ categoria +"</h3>",c);
        c.appendChild(space);
        createElem("hr"+id, "<hr>", c)
        c.appendChild(space)
        createElem("descrizione"+id, "<h4>"+descrizione+"</h4>", c);
        c.appendChild(space);
        //modifica anche qui
        createElem("nump"+id, "<h3><b>Available Places</b></h3>" + "<h4>"+sub+" / "+numero_persone+"</h4>",c);
        c.appendChild(space);

        parent.appendChild(c);
        return c;   
    }
    //post aderiti in profilo
    export function post_aderiti(id,parent,categoria,numero_persone,check,descrizione,user,sub){
        var c=document.createElement("div");
        c.setAttribute("id",id);
        c.setAttribute("class","box-activity");

        const space=document.createElement("div");
        space.setAttribute("class","mb-1");

        createElem("cat"+id,"<h3><b>"+ categoria +"</b></h3>",c);
        c.appendChild(space);
        createElem("hr"+id, "<hr>", c)
        c.appendChild(space)
        if(!check) createElem("user"+id," <h3><b> created by </b>"+ user +"</h3>",c);
        else createElem("user"+id,"<h3><b> Anonymous </b></h3><br>",c);
        c.appendChild(space)
        createElem("descrizione"+id, "<h4>"+descrizione+"</h4>", c);
        c.appendChild(space);
        //modifica anche qui
        createElem("nump"+id, "<h3><b>Available Places</b></h3>" + "<h4>"+sub+" / "+numero_persone+"</h4>",c);
        c.appendChild(space);

        var button=document.createElement("a");
        button.setAttribute("style","text-align:center");
        button.setAttribute("style","color:white");
        button.innerText="Remove sub";

        c.appendChild(button);
        button.addEventListener('click',function(){deleteSub(id,parent,c)});

        parent.appendChild(c);
        return c;   
    }

    function deleteSub(id,parent,c){
    const richiesta= window.confirm("Sicuro di voler eliminare l'adesione");
    if(richiesta){
        let keepLog=localStorage.getItem('KeepLog');
        var CurrentUser=null;

            if(keepLog == "yes"){
                CurrentUser=JSON.parse(localStorage.getItem('user'));
            }
            else{
                CurrentUser=JSON.parse(sessionStorage.getItem('user'));
            }
        try{
        updateDoc(doc(fire, "post", id), {
            sub_restanti: increment(+1),
            sub: arrayRemove(CurrentUser.email)
        });
        parent.removeChild(c);

    }
    catch(e){
        alert(e);
    }
    }
    }

    //fine posti in profilo
    export function att_richiesta(id,parent,categoria,numero_persone,descrizione,sub){
        var c=document.createElement("div");
        c.setAttribute("id",id);
        c.setAttribute("class","box-activity");

        const space=document.createElement("div");
        space.setAttribute("class","mb-1");

        const dele =document.createElement("img");
        dele.setAttribute("width","5%");
        dele.setAttribute("style","border-radius:30%; color:#ffbf00c1");
        dele.setAttribute("src","./css_pages/images/rubbish.jpg");
        c.appendChild(dele);
        dele.addEventListener('click',function(){onDelete(id,parent,c)});


        c.appendChild(space);
        c.appendChild(space);


        createElem("cat"+id,"<h3><b>Categoria:  </b>"+categoria+"</h3>",c);
        c.appendChild(space);
        createElem("nump"+id, "<h3><b>Numero di membri richiesti:  </b></h3>" + "<h4>"+numero_persone+"</h4>",c);
        c.appendChild(space);
        createElem("descrizione"+id, "<h3><b>Descrizione: </b></h3><br>"+ "<h4>"+descrizione+"</h4>", c);
        c.appendChild(space);

        var sub_space=document.createElement("div");
        sub_space.setAttribute("class","row");
        sub_space.setAttribute("style","padding-bottom: 0.5px");
        sub_space.innerHTML="<h3><b>Posti disponibili: </b>"+"<h4>"+sub+"</h4>";
        c.appendChild(sub_space);

        var button=document.createElement("a");
        button.setAttribute("style","text-align:center");
        button.setAttribute("style","color:white");
        button.innerText="Show Contact";
        c.appendChild(button);
        
        button.addEventListener('click',function(){show_sub(id,parent,c)});



        parent.appendChild(c);
        return c;   
    }


    export function show_sub(id,parent,c){
        var child=document.createElement("box-post-bacheca");
        var box=document.createElement("box-post");
        child.appendChild(box);
        const docRef = doc(fire, "post",id);
        getDoc(docRef).then((item) =>{
            var items=item.data()
            var array_sub=items.sub;
            var x;
            for(let elem of array_sub){
                x=document.createElement("div");
                x.setAttribute("class","row-mb-3");
                x.innerText=elem;
                box.appendChild(x);
                x=null;
            }
        })
        var button=document.createElement("button");
        button.setAttribute("class","btn btn-primary btn-sm");
        button.setAttribute("style","text-align:center");
        button.innerText="Hide";
        child.appendChild(button);
        button.addEventListener('click',function(){hideContact(child,c,parent)});
        parent.replaceChild(child,c);
        return c;   
    }

    function hideContact(child,c,parent){
        parent.replaceChild(c,child);
    }


    function onDelete(id,parent,c){
        const richiesta=window.confirm("Elimina post");
        if (richiesta){
        parent.removeChild(c);
        const up={}
        up['/Attivity/'+id]=null;
        update(ref(database),up);
        deleteDoc(doc(fire,"post",id));
        }
    }

    export function getElem(id,parent,type,c,place){
        c=document.createElement("input");
        c.setAttribute("type",type);
        c.setAttribute("id",id);
        c.setAttribute("placeholder",place);
        c.setAttribute("style","background-color: transparent; weigth: 100%; border-color: transparent;");
        c.setAttribute("class","text-warning bg-dark; text-center");
        parent.innerText="";
        parent.appendChild(c);
        return c;
    }

    export function createButton(type,id,text){
        var btnsub=document.createElement("button");
        btnsub.setAttribute("type",type);
        btnsub.setAttribute("id",id);
        btnsub.setAttribute("class","btn btn-light btn-sm");
        btnsub.innerHTML=text;
        return btnsub;
    }
        