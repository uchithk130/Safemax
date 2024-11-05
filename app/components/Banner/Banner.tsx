import Image from "next/image";
import Link from 'next/link';


const Banner = () => {
    return (
        <main>
            <div className="px-6 lg:px-8">
                <div className="mx-auto max-w-7xl pt-16 sm:pt-20 pb-20 banner-image">
                    <div className="text-center">
                        <h1 className="text-4xl font-semibold text-navyblue sm:text-5xl  lg:text-7xl md:4px lh-96">
                        Tackle challenges with a <br /> unified team.
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-bluegray">
                        SafeMax Security is the leading agency providing cybersecurity solutions, <br/>specializing in Vulnerability Assessment & Penetration Testing (VAPT) to safeguard your business from cyber threats.                        </p>
                    </div> 


                    <div className="text-center mt-5">
                        <button type="button" className='text-15px text-white font-medium bg-blue py-5 px-9 mt-2 leafbutton'>
                           <Link href='#appointmentBooking'> Appointment </Link>
                        </button>
                        <button type="button" className='text-15px ml-4 mt-2 text-blue transition duration-150 ease-in-out hover:text-white hover:bg-blue font-medium py-5 px-16 border border-lightgrey leafbutton'>
                            More info
                        </button> 
                        
                    </div>

                    <Image src={'/assets/banner/dashboard.svg'} alt="banner-image" width={1200} height={598} />
                </div>
            </div>
        </main>
    )
}

export default Banner;
