import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const encodeUrl = require('encodeurl')

const config = {
  getQuoteBtnLabel: "New Quote",
  tweetQuoteBtnLabel: "Tweet it"
}

class QuoteText extends React.Component {
  render() {
    return (
    <p className="quote-text">{this.props.quoteText}</p>
    );
  }
}

class QuoteAuthor extends React.Component {
  render() {
    return (
      <p className="quote-author">{this.props.quoteAuthor}</p>
    );
  }
}

class Button extends React.Component {
  render() {
    return (
      <button className="btn btn-primary" onClick={this.props.handleClick} type="button">{this.props.label}</button>
    );
  }
}

class Link extends React.Component {
  render() {
    return (
      <a className="btn btn-link" href={this.props.href} target="_blank">{this.props.label}</a>
    );
  }
}

class QuoteMachine extends React.Component {
  constructor(props) {
    super(props);
    this.getQuote = this.getQuote.bind(this);

    this.state = {
      error: null,
      quoteAuthor: '',
      quoteText: '',
      tweetUrl: ''
    };
  }
  
  getQuote() {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const targetUrl = "https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en&jsonp=?";

     fetch(proxyUrl + targetUrl, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
      })
      .then(response => response.json())
      .then((result) => {
        let encodedText = encodeUrl(result.quoteText);
        let encodedAuthor = encodeUrl(result.quoteAuthor);

        if (result.quoteAuthor !== "") {
          this.setState({
            quoteAuthor: result.quoteAuthor,
            quoteText: result.quoteText,
            tweetUrl: `https://twitter.com/intent/tweet?text=${encodedText} -${encodedAuthor}`
          });
        } else {
          this.setState({
            quoteAuthor: "Unknown",
            quoteText: result.quoteText,
            tweetUrl: `https://twitter.com/intent/tweet?text=${encodedText}-${encodedAuthor}`
          });
        }
      },
      (error) => {
        this.setState({
          error
        });
      });
  }


  componentDidMount() {
    this.getQuote()
  }
      
  render() {
    console.log(this.state)

    return (
      <div className="quote-container">
        <QuoteText quoteText={this.state.quoteText} />
        <QuoteAuthor quoteAuthor={this.state.quoteAuthor}/>
        <div className="button-group d-flex align-items-end flex-column">
          <div className="d-flex">
            <Button label={config.getQuoteBtnLabel} handleClick={this.getQuote}/>
            <Link label={config.tweetQuoteBtnLabel} href={this.state.tweetUrl}/>
          </div>
        </div>  
      </div>
    );
  }
}

ReactDOM.render(<QuoteMachine />, document.getElementById("root"));