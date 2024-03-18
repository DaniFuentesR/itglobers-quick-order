import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "react-apollo";
import UPDATE_CART from "../graphql/updateCart.graphql";
import GET_PRODUCT from "../graphql/getProductBySku.graphql"

const QuickOrder = () => {

    const [inputText, setInputText] = useState("");
    const [search, setSearch] = useState("");

    const [getProductData, {data: product}] = useLazyQuery(GET_PRODUCT)
    const [addToCart] = useMutation (UPDATE_CART);

    const handleChange = (event:any) => {
        setInputText(event.target.value)
        console.log("Input Changed: ", inputText);    
    }

    // Este efecto se va a activar cuando la búsqueda se active y el producto llegue. 
    useEffect(() => {
        console.log("El resultado de mi producto es: ", product, search);

        if(product){
            let skuId = parseInt(inputText) /** el parseInt es porque en la mutacion del checkout dice que el id = Int => Es decir que el id debe ser un número entero */
            addToCart({
                variables: {
                    salesChannel: "1",
                    items: [
                        {
                            id: skuId,
                            quantity: 1,
                            seller: "1"
                        }
                    ]
                }
            })
            .then(()=>{
                window.location.href = "/checkout"
            })
        }
        
    }, [product, search])

    const addProductToCart =  () => {
        getProductData({
            variables: {
                sku: inputText
            }
        })
    }

    const searchProduct = (event: any) => {
        event.preventDefault(); 
        
     if(!inputText){
        alert("Ingresa algún contenido!")
     } else{
        console.log("al final estamos buscando: ", inputText);
        setSearch(inputText);
        addProductToCart()
        
     }
       
        
    }



    return(
        <div>
            <h2>Compra Rapida GS</h2>

            
                <form onSubmit={searchProduct}>
                    <div>
                        <label htmlFor="sku">Ingresa el número de SKU</label>
                        <input type="text" id="sku" onChange={handleChange}/>
                    </div>
                    <input type="submit" value="Añadir al carrito" />
                </form>
            
        </div>
    )
}

export default QuickOrder; 