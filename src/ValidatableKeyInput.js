import React from 'react';

export class ValidatableKeyInput extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            //sPublicKey: '',
          }
        }
    render() {
      return (
        <div className="shopping-list">
          <h1>Shopping List for {this.props.name}</h1>
          <ul>
            <li>Instagram</li>
            <li>WhatsApp</li>
            <li>Oculus</li>
          </ul>
        </div>
      );
    }
  }