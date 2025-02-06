import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import "../../css/ArtConfirm.css"
import { VnpayPayment } from '../../API/ArtShop/ArtShopServices';
import { useNavigate } from 'react-router-dom';

export default function ArtShopConfirm(props) {
    let {
        open,
        item,
        handleClose
    } = props;
    const auth = JSON.parse(sessionStorage.getItem("auth"));
    const [dataItem, setDataItem] = React.useState({});
    const navigate = useNavigate()  
    const convertData = (value) => {
        return {
            orderDetailID: 0,
            orderID: 0,
            artWorkID: value?.artworkID,
            dateOfPurchase: new Date(),
            price: value?.price * 1000,
            order: {
                orderID: 0,
                sellerID: value?.creatorID,
                confirmation: true,
                buyerID: auth?.creatorID
            },
            purchaseConfirmationImag: "string",
            emai: "string"
        }
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            // const data = convertData(dataItem);
            // console.log(data)
            const data = await VnpayPayment(convertData(dataItem));
            window.location.href = data?.data;
        } catch (error) {
        }
    }
    React.useEffect(() => {
        setDataItem(item)
    }, [])
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className='dialog-custom'
            style={{
                borderRadius: 50,
                background: "none"
            }}
        >
            <section class="add-card page">
                <form class="form" onSubmit={handleSubmit}>
                    <label for="name" class="label">
                        <span class="title">Image name</span>
                        <input
                            class="input-field"
                            type="text"
                            name="imagename"
                            value={item?.artworkName}
                            title="Image name"
                            placeholder=""
                        />
                    </label>
                    <label for="serialCardNumber" class="label">
                        <span class="title">Price</span>
                        <input
                            id="serialCardNumber"
                            class="input-field"
                            value={item?.price * 1000 + " VND"}
                            name="price"
                            title="Input title"
                            placeholder=""
                        />
                    </label>
                    <button class="checkout-btn" type='submit'>Checkout</button>
                </form>
            </section>
        </Dialog>
    );
}
