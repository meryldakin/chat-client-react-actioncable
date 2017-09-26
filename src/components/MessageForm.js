import React, { Component } from "react";

class MessageForm extends Component {
  render() {
    return (
      <form>
        Write message:
        <input type="text" />
        <input type="submit" />
      </form>
    );
  }
}

export default MessageForm;
