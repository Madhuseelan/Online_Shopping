import { useEffect, useState } from "react";

import {
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
} from "../api/api";

import "./Addresses.css";


// =====================================================
// EMPTY FORM
// =====================================================

const EMPTY_FORM = {
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
};


// =====================================================
// ADDRESSES PAGE
// =====================================================

function Addresses() {

    const [addresses, setAddresses] = useState([]);

    const [form, setForm] = useState(EMPTY_FORM);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);


    // =================================================
    // LOAD ADDRESSES
    // =================================================

    const loadAddresses = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getAddresses();

            console.log("ADDRESS DATA:", data);

            // Django may return array
            // or { results: [] }

            if (Array.isArray(data)) {

                setAddresses(data);

            } else if (Array.isArray(data.results)) {

                setAddresses(data.results);

            } else {

                setAddresses([]);
            }

        } catch (error) {

            console.error("LOAD ADDRESS ERROR:", error);

            setError(
                error.response?.data?.detail ||
                "Unable to load addresses."
            );

        } finally {

            setLoading(false);
        }
    };


    // =================================================
    // LOAD ON PAGE START
    // =================================================

   useEffect(() => {
    const load = async () => {
        await loadAddresses();
    };

    load();
}, []);

    // =================================================
    // INPUT CHANGE
    // =================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    // =================================================
    // OPEN ADD FORM
    // =================================================

    const handleAdd = () => {

        setEditingId(null);

        setForm(EMPTY_FORM);

        setShowForm(true);

        setError("");
    };


    // =================================================
    // EDIT ADDRESS
    // =================================================

    const handleEdit = (address) => {

        setEditingId(address.id);

        setForm({
            name: address.name || "",
            phone: address.phone || "",
            address: address.address || "",
            city: address.city || "",
            state: address.state || "",
            pincode: address.pincode || "",
        });

        setShowForm(true);

        setError("");
    };


    // =================================================
    // CANCEL
    // =================================================

    const handleCancel = () => {

        setEditingId(null);

        setForm(EMPTY_FORM);

        setShowForm(false);

        setError("");
    };


    // =================================================
    // SAVE ADDRESS
    // =================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            setError("");


            if (editingId) {

                // UPDATE

                await updateAddress(
                    editingId,
                    form
                );

            } else {

                // CREATE

                await createAddress(form);
            }


            // Reload addresses

            await loadAddresses();


            // Reset

            handleCancel();

        } catch (error) {

            console.error(
                "SAVE ADDRESS ERROR:",
                error
            );

            setError(
                error.response?.data ||
                "Unable to save address."
            );

        } finally {

            setSaving(false);
        }
    };


    // =================================================
    // DELETE
    // =================================================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this address?"
        );

        if (!confirmDelete) {
            return;
        }


        try {

            setError("");

            await deleteAddress(id);

            await loadAddresses();

        } catch (error) {

            console.error(
                "DELETE ADDRESS ERROR:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Unable to delete address."
            );
        }
    };


    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        return (
            <div className="addresses-page">

                <h1>My Addresses</h1>

                <p>Loading addresses...</p>

            </div>
        );
    }


    // =================================================
    // UI
    // =================================================

    return (
        <div className="addresses-page">

            <div className="addresses-header">

                <div>
                    <h1>My Addresses</h1>

                    <p>
                        Manage your delivery addresses
                    </p>
                </div>

                {!showForm && (
                    <button
                        className="add-address-btn"
                        onClick={handleAdd}
                    >
                        + Add Address
                    </button>
                )}

            </div>


            {/* ERROR */}

            {error && (
                <div className="address-error">
                    {typeof error === "string"
                        ? error
                        : JSON.stringify(error)}
                </div>
            )}


            {/* =================================================
                FORM
            ================================================= */}

            {showForm && (

                <div className="address-form-container">

                    <h2>
                        {editingId
                            ? "Edit Address"
                            : "Add New Address"}
                    </h2>


                    <form onSubmit={handleSubmit}>

                        <div className="form-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Address
                            </label>

                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="House No, Street, Area"
                                rows="3"
                                required
                            />

                        </div>


                        <div className="form-row">

                            <div className="form-group">

                                <label>
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    State
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={form.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                    required
                                />

                            </div>

                        </div>


                        <div className="form-group">

                            <label>
                                Pincode
                            </label>

                            <input
                                type="text"
                                name="pincode"
                                value={form.pincode}
                                onChange={handleChange}
                                placeholder="Enter pincode"
                                required
                            />

                        </div>


                        <div className="form-actions">

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="save-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Address"
                                        : "Save Address"}
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* =================================================
                ADDRESS LIST
            ================================================= */}

            {!showForm && (

                <div className="address-list">

                    {addresses.length === 0 ? (

                        <div className="empty-address">

                            <h2>
                                No addresses found
                            </h2>

                            <p>
                                Add an address for faster checkout.
                            </p>

                            <button
                                onClick={handleAdd}
                                className="add-address-btn"
                            >
                                + Add Your First Address
                            </button>

                        </div>

                    ) : (

                        addresses.map((item) => (

                            <div
                                className="address-card"
                                key={item.id}
                            >

                                <div className="address-card-header">

                                    <h2>
                                        {item.name}
                                    </h2>

                                    <span>
                                        📍 Address
                                    </span>

                                </div>


                                <p>
                                    📞 {item.phone}
                                </p>

                                <p>
                                    {item.address}
                                </p>

                                <p>
                                    {item.city}, {item.state}
                                </p>

                                <p>
                                    <strong>
                                        PIN: {item.pincode}
                                    </strong>
                                </p>


                                <div className="address-actions">

                                    <button
                                        onClick={() =>
                                            handleEdit(item)
                                        }
                                        className="edit-btn"
                                    >
                                        Edit
                                    </button>


                                    <button
                                        onClick={() =>
                                            handleDelete(item.id)
                                        }
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            )}

        </div>
    );
}


export default Addresses;