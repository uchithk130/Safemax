import Banner from './components/Banner/Banner';
import Companies from './components/Companies/Companies';
import Buyers from './components/Buyers/index';
import Provide from './components/Provide/index';
import Why from './components/Why/index';
import Network from './components/Network/index';
import Clientsay from './components/Clientsay/index';

import Appointment from './components/Newsletter/Appointment';


export default function Home() {
  return (
    <main>
      <Banner />
      <Companies />
      <Buyers />
      <Provide />
      <Why />
      <Network />
      <Clientsay />
      <Appointment />
    </main>
  )
}
