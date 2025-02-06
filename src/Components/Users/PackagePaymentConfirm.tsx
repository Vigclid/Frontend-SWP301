import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import "../../css/ArtConfirm.css"
import { useNavigate } from 'react-router-dom';
import { Package } from '../../Interfaces/Package';
import { VnpayPackagePayment } from '../../API/PackageAPI/POST.tsx';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';

export default function PackagePaymentConfirm(props) {
    const [loading, setLoading] = useState(false);
    let {
        open,
        item,
        handleClose
    } = props;
    const auth = JSON.parse(sessionStorage.getItem("auth")??"");
    const [dataItem, setDataItem] = React.useState<Package>();
    const convertData = (value:Package) => {
        return {
            packageID: value.packageID,
            packageName: value.packageName,
            packageDescription: value.packageDescription,
            packagePrice: value.packagePrice,
        }
    }

    const handleSubmit = async (e) => {
        try {
            setLoading(true)
            e.preventDefault();
             //const data = convertData(dataItem);
             console.log(dataItem)
            const data = await VnpayPackagePayment(convertData(dataItem))
            window.location.href = data?.data;
            setLoading(false)
        } catch (error) {
        }
    }
    React.useEffect(() => {
        setDataItem(item)
    },)
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
            <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 100 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            <section className="add-card page">
                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="name" className="label">
                        <span className="title">Image name</span>
                        <input
                            className="input-field"
                            type="text"
                            name="imagename"
                            value={item?.packageName}
                            title="Image name"
                            placeholder=""
                        />
                    </label>
                    <label htmlFor="serialCardNumber" className="label">
                        <span className="title">Price</span>
                        <input
                            id="serialCardNumber"
                            className="input-field"
                            value={item?.packagePrice + " VND"}
                            name="price"
                            title="Input title"
                            placeholder=""
                        />
                    </label>
                    <button className="checkout-btn" type='submit'>Checkout</button>
                </form>
            </section>
        </Dialog>
    );
}
