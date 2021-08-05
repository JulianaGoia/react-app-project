import React, { useState, useEffect } from 'react';
import './App.css';


//consumo da API para listar usuarios
function  App() {

  const [client, setClient] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [cardSelect, setCardSelect] = useState("");
  const [selectClient, setSelectClient] = useState({});
  const [value, setValue] = useState("");
  const [showTransaction, setShowTransaction] = useState("none");
  const [payment, setPayment] = useState("");

  //listagem de cartões
 const cards = [
  // valid card
  {
      card_number: '1111111111111111',
      cvv: 789,
      expiry_date: '01/18',
  },
  // invalid card
  {
      card_number: '4111111111111234',
      cvv: 123,
      expiry_date: '01/20',
  }
];
  

  useEffect(() => {
    fetch("https://www.mocky.io/v2/5d531c4f2e0000620081ddce", {
        method: 'get'
    })
        .then((data) => data.json())
        .then((result) => {
            setClient(result)
        })
}, [])


// função para aparecer modal
const showModal = () => {
  setModalOpen(true);

}

const sendTransaction = () => {

  const transaction = {
    "card_number": cards[cardSelect].card_number,
    "cvv": cards[cardSelect].cvv,
    "expiry_date": cards[cardSelect].expiry_date,
    "destination_user_id": selectClient.id,
    "value": value
  }

  fetch ("https://run.mocky.io/v3/533cd5d7-63d3-4488-bf8d-4bb8c751c989", {
            method: "post",
            body: transaction
        })
          .then(response => response.json())
          .then((data) => {
              console.log(data)
              setModalOpen(false)
              setShowTransaction("block")
        //condição para mostrar mensagem no recibo de pagamento
              if (data.status === "Aprovada") {
                setPayment("Pagamento concluído com sucesso.")

            } else { 
                setPayment("Pagamento NÃO foi concluído com sucesso.")
            }
        })
    }


    return (
      <>
      {/*Lista de usuarios*/}
        <div className = 'body'>
           {client.map(item => (

             <ul className = 'list'>
                  <li className = 'users'>

                 <img src={item.img} className = 'images'></img>
                  <p className ='txt'>Nome do Usuário: {item.name} <br></br>
                  ID: {item.id}
                  Username: {item.username}</p>

                  <input type='button' value='Pagar' className = 'btn' onClick = {() => showModal()}></input>
                  </li>
             </ul>
            ))}
       </div>

       {/* Modal de pagamento*/}
       <div className = "backdrop"  style = {{display: (modalOpen ? 'block' : 'none')}}>
          <div className = "modal" >
            <form className = "modal-form" >
                <label className ="modal-label"> Pagamento para: {client.name}</label> 

                <input className = "form-input" type='number' placeholder='R$ 0.00'  ></input>
                <select className = "form-select" required value = {cardSelect} onChange = {e => setCardSelect(e.target.value)}>
                  
                      {cards.map((card, i) => {
                        return <option key={'optionCard' + i} value={i}>Cartão com final {card.card_number.substring(12)}
                        </option>
                    })}
                </select>

                <button className = "form-button" onClick = {() => sendTransaction()}> Pagar </button>
            </form>
          </div>
        </div>

        {/* Recibo de pagamento*/}
        <div className = "modal-receipt" style = {{ display: showTransaction }}>
           <span className = "receipt-title"> Recibo de pagamento</span>

           <div className = "receipt-msg">
              {payment}
           </div>
      
        </div>
        </>
    );
  }

export default App; 