import React, { useState, useEffect } from 'react';
import './App.css';


//consumo da API para listar usuarios
function  App() {

  const [client, setClient] = useState([]); //const para fazer a listagem de clientes
  const [modalOpen, setModalOpen] = useState(false); //const para abrir modal de pagamento
  const [cardSelect, setCardSelect] = useState(""); //const para identificar as informações do cartão
  const [selectClient, setSelectClient] = useState({}); //const para pegar o nome do cliente
  const [value, setValue] = useState(""); //const para identifica o valor da transferência
  const [showTransaction, setShowTransaction] = useState("none"); //const para abrir a modal de recibo de pagamento
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


// função para abrir modal de pagamento
const showModal = (index) => {
  setModalOpen(true);  //a modal abre
  setCardSelect(index);  //
  setSelectClient(client[index]); //states que vai identificar o cliente e sua posiçao

}

// função para fechar modal de pagamento
const closeModal = () => {
  setModalOpen(false);
  setShowTransaction('none');
  setPayment("");

}

 //função para fechar modal de recibo
const resetPage = () => {
  setPayment("");
  setCardSelect("");
  setShowTransaction("none");
  
}

const sendTransaction = (event) => {
  event.preventDefault()

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
              setModalOpen(false)
              setShowTransaction("block")
        
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
           {client.map((item, index) => (

             <ul className = 'list'>
                  <li className = 'users'>

                 <img src={item.img} className = 'images'></img>
                  <p className ='txt'>Nome do Usuário: {item.name} <br></br>
                  ID: {item.id}
                  Username: {item.username}</p>

                  {/* A 'index' identifica a posição do cliente na listagem */}
                  <input type='button' value='Pagar' className = 'btn' onClick = {() => showModal(index)}></input>
                  </li>
             </ul>
            ))}
       </div>

       {/* Modal de pagamento*/}
       {/* Fechar Modal pelo método de backdrop
       <div className = "backdrop" style = {{display: (modalOpen ? 'block' : 'none')}} onClick = {() => modalOpen(false)}>
          </div>
       */}
       
          <div className = "modal" style = {{display: (modalOpen ? 'block' : 'none')}}>
            <form className = "modal-form" onSubmit = {(event) => sendTransaction(event)}>
                <p className ="modal-label"> Pagamento para: 
                  <strong className = "clientName"> {selectClient.name} </strong>
                </p> 

                <input className = "form-input" type='number' placeholder='R$ 0.00'></input>
                <select className = "form-select" required value = {cardSelect} onChange = {e => setPayment(e.target.value)}>
                  
                      {cards.map((card, i) => {
                        return <option key={'optionCard' + i} value={i}>Cartão com final {card.card_number.substring(12)}
                        </option>
                    })}
                </select>

                <button className = "form-button" > Pagar </button>
                <button className = "close-modal" onClick = {() => closeModal()}> Fechar </button>
            </form>
          </div>
        

        {/* Recibo de pagamento*/}
        <div className = "modal-receipt" style = {{ display: showTransaction }} >
           <div className = "receipt-title"> Recibo de pagamento</div>
           
           <div className = "receipt-msg"> {payment} </div>

           <div className = "close-receipt">
              <button onClick = {() => resetPage()}> X </button>

           </div>
           
        </div>
        
        </>
    );
  }

export default App; 