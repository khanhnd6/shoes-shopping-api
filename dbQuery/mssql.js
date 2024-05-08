const STOREPROCEDURES = {
    GETCATEGORY: "sp_get_category",
    
    GETPRODUCT: "sp_get_product",
    GETPRODUCTOVR: "sp_get_product_ovr",
    GETPASSWORD: "sp_getPassword",
    LOGIN: "sp_login",


    GETCARTITEMS: "sp_get_cart_item",
    UPDATECARTITEM: "sp_update_cart_item",
    DELETECARTITEM: "sp_remove_cart_item",
    ADDTOCART: "sp_add_to_cart",

    MAKINGORDERFROMCART: "sp_make_order_from_cart",
    MAKINGORDERQUICKLY: "sp_make_order_quickly",
    GETORDERS: "sp_getOrder",
    GETORDERITEMS: "sp_getOrderItems",
    CANCELORDER: "sp_cancel_order",

    ADMIN_LOGIN: "sp_login_admin",
    ADMIN_UPDATECATEGORY: "sp_update_category",
    ADMIN_UPDATEPRODUCT: "sp_update_product",
    ADMIN_SHOWPRODUCT: "sp_unhide_product", 
    ADMIN_HIDEPRODUCT: "sp_hide_product",
    ADMIN_ADDPRODUCT: "sp_insert_product",
    ADMIN_DELETEPRODUCT: "sp_delete_product",

    REGISTER: "sp_register",

    GETVOUCHER: "sp_get_voucher",
    GETCOMMON: "sp_get_common",
    ADDVOUCHER: "sp_addVoucher",

    GETCUSTOMER: "sp_get_customer"

}


module.exports = {
    STOREPROCEDURES
}