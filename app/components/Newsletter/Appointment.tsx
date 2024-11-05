"use client"
import Image from "next/image";
import { useState } from "react";

const Appointment = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        date: "",
        comments: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Process form data, send to backend, etc.
        console.log("Form submitted:", formData);
    };

    return (
        <div id="appointmentBooking">
            <div className='-mt-32 relative z-3'>
                <div className="mx-auto max-w-2xl lg:max-w-7xl bg-blue-500 rounded-3xl">
                    <div className="grid grid-cols-1 gap-y-10 gap-x-6 lg:grid-cols-2 xl:gap-x-8">

                        {/* COLUMN-1 */}
                        <div className='hidden lg:block'>
                            <div className='float-right pt-20 relative'>
                                <Image src={'/assets/newsletter/bgImage.png'} alt="bgimg" width={588} height={334} />
                                <div className="absolute top-10 right-0">
                                    <Image src={'/assets/newsletter/leaf.svg'} alt="leafimg" width={81} height={81}/>
                                </div>
                                <div className="absolute bottom-8 left-2">
                                    <Image src={'/assets/newsletter/circel.svg'} alt="circleimg" width={30} height={30}/>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN-2 */}
                        <div className="p-10 flex flex-col justify-center">
                            <h3 className="text-4xl md:text-5xl font-semibold mb-3 text-white">Book an Appointment</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-white">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="py-3 text-sm w-full text-black bg-white rounded-lg pl-4"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-white">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="py-3 text-sm w-full text-black bg-white rounded-lg pl-4"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="date" className="block text-white">Preferred Date/Time</label>
                                    <input
                                        type="datetime-local"
                                        name="date"
                                        id="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        className="py-3 text-sm w-full text-black bg-white rounded-lg pl-4"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="comments" className="block text-white">Additional Comments</label>
                                    <textarea
                                        name="comments"
                                        id="comments"
                                        value={formData.comments}
                                        onChange={handleChange}
                                        required
                                        className="py-3 text-sm w-full text-black bg-white rounded-lg pl-4"
                                        placeholder="Any specific details or requests"
                                    />
                                </div>
                                <button type="submit" className="bg-midblue text-white font-medium py-3 px-6 rounded-lg mt-4">
                                    Book Appointment
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Appointment;
