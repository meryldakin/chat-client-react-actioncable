import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Cable from "actioncable";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentChatMessage: "",
      chatLogs: []
    };
  }

  componentDidMount() {
    this.createSocket();
    fetch("http://localhost:3000/chat_messages")
      .then(data => data.json())
      .then(res =>
        this.setState({
          chatLogs: res
        })
      );
  }

  updateCurrentChatMessage(event) {
    this.setState({
      currentChatMessage: event.target.value
    });
  }

  handleSendEvent(event) {
    event.preventDefault();
    this.chats.create(this.state.currentChatMessage);
    this.setState({
      currentChatMessage: ""
    });
  }

  createSocket() {
    let cable = Cable.createConsumer("ws://localhost:3000/cable");
    this.chats = cable.subscriptions.create(
      {
        channel: "ChatChannel"
      },
      {
        connected: () => {},
        received: data => {
          let chatLogs = this.state.chatLogs;
          chatLogs.push(data);
          this.setState({ chatLogs: chatLogs });
        },
        create: function(chatContent) {
          this.perform("create", {
            content: chatContent
          });
        }
      }
    );
  }

  renderChatLog() {
    return this.state.chatLogs.map(el => {
      return (
        <li key={`chat_${el.id}`}>
          <span className="chat-message">{el.content}</span>
          <span className="chat-created-at">{el.created_at}</span>
        </li>
      );
    });
  }

  render() {
    return (
      <div className="App">
        <div className="stage">
          <h1>Chat</h1>
          <div className="chat-logs" />
          <input
            value={this.state.currentChatMessage}
            onChange={e => this.updateCurrentChatMessage(e)}
            type="text"
            placeholder="Enter your message..."
            className="chat-input"
          />
          <button onClick={e => this.handleSendEvent(e)} className="send">
            Send
          </button>
          <ul className="chat-logs">{this.renderChatLog()}</ul>
        </div>
      </div>
    );
  }
}

export default App;
