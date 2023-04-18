import React, { useEffect, useState } from 'react';
import "./ArticleListContainer.css";
import ArticleList from '../ArticleList/ArticleList';
import Carrusel from '../Carrusel/Carrusel';
import Especial from '../Especial/Especial';
import { collection, query, getDocs, getDoc, doc, where } from 'firebase/firestore';
import db from '../../firebase';
import {useUserAuth} from '../../Context/UserAuthContext';
import { useLocation, useHistory } from "react-router-dom";

import { useParams } from "react-router-dom";

function ArticleListContainer() {

    /*const {user} = useUserAuth();
    console.log(user.email);
    const history = useHistory()
    {!user && history.push("/testing")}   */

    const {categoria} = useParams();

    const [articulos, setArticulos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [special, setSpecial] = useState();
   
/*    const location = useLocation();

    useEffect(() => {
      console.log('Location changed');
    }, [location]);*/
  
    useEffect(() => {

      async function getArticulos() {
          const arr = []

          const docRef = doc(db, "especial", "especialprincipal");
          const docSnap = await getDoc(docRef);
          console.log("console log DOCSNAP.DATA")
          console.log(docSnap.data())
          setSpecial(docSnap.data())
  
          if(categoria!=null) {
      
              const q = query(collection(db, "articles"), where("categories", "array-contains", (categoria)), where("estado", "==", "publicado"))
              const querySnapshot = await getDocs(q);
              
              querySnapshot.forEach(item => {
              arr.push(item.data())
              })
              arr.sort((a,b) => b.fecha - a.fecha);
              setArticulos(arr);
              setLoading(false);
  
          } else {  
              const q = query(collection(db, "articles"), where("estado", "==", "publicado"))
              const querySnapshot = await getDocs(q);
              querySnapshot.forEach((item) => {
                  arr.push(item.data())
                  });
                  arr.sort((a,b) => b.fecha - a.fecha);
                  setArticulos(arr);
                  setLoading(false);
          }}
  
        getArticulos()  
      
  }, [categoria]);
  

  console.log(articulos);
  

    return (
        <main>
            <div>
            {categoria!=null ?
                <h1 className="tituloseccion"> {categoria.toLowerCase()} </h1> 
                : 
                <>
                    <Carrusel articulos={articulos}
                                loading={loading}   
                    />

                    {special &&
                    <Especial articulos={articulos}
                                loading={loading}
                                special={special}
                                />
                            }
                </>
             }
             </div>   

            <div className="listadoArticulos"> 

                {<ArticleList articulos={articulos}
                              loading={loading}
                              special={special}
                />}
            </div>
        
      </main>
    )

}

export default ArticleListContainer;

