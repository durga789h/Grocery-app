import axios from 'axios'
//import { CardData } from '../_components/ProductItemDetail'

export interface OrderItemData {
    id: number;
    quantity: number;
    amount: number;
    product: {
        data: {
            id: number;
            attributes: {
                name: string;
                description: string;
                mrp: number;
                sellingPrice: number;
                itemQuantityType: string;
                slug: string;
                createdAt: string;
                updatedAt: string;
                publishedAt: string;
                images: {
                    data: {
                        id: number;
                        attributes: {
                            name: string;
                            alternativeText: string | null;
                            caption: string | null;
                            width: number;
                            height: number;
                            formats: any;
                            hash: string;
                            ext: string;
                            mime: string;
                            size: number;
                            url: string;
                            previewUrl: string | null;
                            provider: string;
                            provider_metadata: any | null;
                            createdAt: string;
                            updatedAt: string;
                        };
                    }[];
                };
            };
        };
    };
}


export interface UserData {
    id: number;
    username: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    email: string;
    phone: string;
    zip: string;
    address: string;
    totalOrderAmount: number;
    userId: number;
    paymentId: string;
    Status:string;
    orderItemList: OrderItemData[];
}

interface item {
    id: number;
    attributes: {
        quantity: number;
        amount: number;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        userId: number;
        products: {
            data: {
                id: number;
                attributes: {
                    name: string;
                    description: string;
                    mrp: number;
                    sellingPrice: number;
                    itemQuantityType: string;
                    slug: string;
                    createdAt: string;
                    updatedAt: string;
                    publishedAt: string;
                    images: {
                        data: {
                            id: number;
                            attributes: {
                                name: string;
                                alternativeText: string | null;
                                caption: string | null;
                                width: number;
                                height: number;
                                formats: any; // Define the formats type if needed
                                hash: string;
                                ext: string;
                                mime: string;
                                size: number;
                                url: string;
                                previewUrl: string | null;
                                provider: string;
                                provider_metadata: any | null; // Define the provider_metadata type if needed
                                createdAt: string;
                                updatedAt: string;
                            };
                        }[];
                    };
                };
            }[];
        };
    };
}


const axiosClient=axios.create({
    baseURL:"http://localhost:1337/api"
})

const getCategory=()=>axiosClient.get("/categories?populate=*")

const getSliders=()=>axiosClient.get("/sliders?populate=*").then(resp=>{return resp.data.data})

const getCategoryList=()=>axiosClient.get("/categories?populate=*").then(resp=>{
    return resp.data.data
})
const getAllProducts=()=>axiosClient.get("/products?populate=*").then(resp=>{
    return resp.data.data
})
const getProductsByCategory = (category: string) => axiosClient.get(`/products?filters[categories][name][$in]=${category}&populate=*`).then(resp=>{
    return resp.data.data;
})
const registerUser=(username:string,email:string,password:string)=>axiosClient.post("/auth/local/register",{
    username:username,
    email:email,
    password:password
})
const SignIn=(email:string,password:string)=>axiosClient.post("/auth/local",{
    identifier:email,
    password:password
})

//const forgetpassword=(email:string,password:string)=>axiosClient.post("/auth/forgot-password")
const addToCard=(data:object,jwt:string)=>axiosClient.post("/user-carts",data,{
    headers:{
        Authorization:"Bearer "+jwt
    }
})

const getCartItems = (userId: number, jwt: string) => axiosClient.get(`/user-carts?filters[userId][$eq]=${userId}&[populate][products][populate][images][populate][0]=url`, {
    headers: {
        Authorization: "Bearer " + jwt
    }
}).then(resp => {
    const data = resp.data.data;
  //  console.log(data)
    const cartItemsList = data.map((item: any) => {
        // Check if products exist and it's an object
        if (item.attributes.products && typeof item.attributes.products.data === 'object') {
            // Assuming there's only one product per cart item
            const product = item.attributes.products.data;
            return {
                name: product.attributes?.name || "Product Name Not Found",
                quantity: item.attributes.quantity,
                amount: item.attributes.amount,
                image: product.attributes.images.data[0]?.attributes.url || "Image URL Not Found",
                actualPrice: product.attributes?.mrp || "Price Not Found",
                id: item.id,
                product:product.id
            };
        } else {
            // Handle if there are no products or if it's not an object
            return {
                name: "Product Not Found",
                quantity: item.attributes.quantity,
                amount: item.attributes.amount,
                image: "Image Not Found",
                actualPrice: "Price Not Found",
                id: item.id,
            
            };
        }
    });
   console.log(cartItemsList);

    return cartItemsList;
});

const deleteCartItem=(id:number,jwt:string)=>axiosClient.delete(`/user-carts/`+id,{
    headers:{
        Authorization:"Bearer "+jwt
    }
})

const createOrder=(data:object,jwt:string)=>axiosClient.post("/orders",data,{
headers:{
    Authorization:"Bearer " +jwt
}
})

const getMyOrder = (userId: number, jwt: string) => axiosClient.get(`/orders?filters[userId][$eq]=${userId}&populate[orderItemList][populate][product][populate][images]=url`).then(
    resp => {
        const response = resp.data.data;
        const orderList: UserData[] = response.map((item: any) => ({
            id: item.id,
            totalOrderAmount: item.attributes.totalOrderAmount,
            createdAt: item.attributes.createdAt,
            paymentId: item.attributes.paymentId,
            status:item.attributes.Status,
            orderItemList: item.attributes.orderItemList.map((orderItem: any) => ({
                id: orderItem.id,
                quantity: orderItem.quantity,
                amount: orderItem.amount,
                product: {
                    data: {
                        id: orderItem.product.data.id,
                        attributes: {
                            name: orderItem.product.data.attributes.name,
                            description: orderItem.product.data.attributes.description,
                            mrp: orderItem.product.data.attributes.mrp,
                            sellingPrice: orderItem.product.data.attributes.sellingPrice,
                            itemQuantityType: orderItem.product.data.attributes.itemQuantityType,
                            slug: orderItem.product.data.attributes.slug,
                            createdAt: orderItem.product.data.attributes.createdAt,
                            updatedAt: orderItem.product.data.attributes.updatedAt,
                            publishedAt: orderItem.product.data.attributes.publishedAt,
                            images: {
                                data: orderItem.product.data.attributes.images.data
                            }
                        }
                    }
                }
            }))
        }));
        return orderList;
    }
);




export default{
    getCategory,
    getSliders,
    getCategoryList,
    getAllProducts,
    getProductsByCategory,
    registerUser,
    SignIn,
    addToCard,
    getCartItems,
    deleteCartItem,
    createOrder,
    getMyOrder
}