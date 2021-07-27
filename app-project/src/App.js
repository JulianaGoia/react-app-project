import React from 'react';
import './App.css';

//consumo da API para listar usuarios
class App extends React.Component {
  state = {
    cliente: []
  };

  componentDidMount() {
    fetch ('https://www.mocky.io/v2/5d531c4f2e0000620081ddce')

        .then(res => res.json())
        .then(res => {
            this.setState({
              cliente: res
            });
        });
  }

  render() {
    return (
      <div className = 'body'>
          {this.state.cliente.map(item => (
           
          <li>
            <ul className = 'list'>
              <div className = 'users'>

              <img src={item.img} className = 'img'></img>
              <p className ='txt'>Nome Usuário: {item.name} <br></br>
              ID: {item.id}
              Username: {item.username}</p>
              
                
              <input type='button' value='Pagar' className = 'btn'></input>
              </div>

            </ul>
          </li>
            
          ))}

      </div>
    );

  }
}

export default App; 