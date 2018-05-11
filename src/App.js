import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';

var events = require('events');
window.ee = new events.EventEmitter();

var   my_news  = [
     {
        author : 'Саша  Печкин' ,
        text : 'В четчерг,  четвертого  числа...' ,
        bigText : 'в  четыре  с четвертью часа  четыре  чёрненьких  чумазеньких чертёнка  чертиличёрными чернилами чертёж.'
     } ,
     {
        author : 'Просто  Вася' ,
        text : 'Считаю, что $ должен  стоить  35  рублей!' ,
        bigText : 'А  евро  42!'
     } ,
     {
        author : 'Гость' ,
        text : 'Бесплатно.  Скачать.  Лучший  сайт  - http://localhost:3000' ,
        bigText : 'На самом деле  платно, просто  нужно прочитать очень длинное лицензионное  соглашение'
     }
] ;

class News extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      counter : 0
    };
  }

  allClick (e) {
    e . preventDefault ( ) ;
    this.setState({counter: ++this.state.counter});
  }

  render() {
    var  data   = this.props.data;
    var  newsTemplate; 

    if ( data . length   > 0 ) {
      newsTemplate=  data.map ( function ( item ,  index ) {
        return (
          <div  key = { index }>
              <Article data = { item } />
          </div>
        );
      })
    } else {
        newsTemplate   = <p> К  сожалению новостей  нет </p>
      }

    return (
          <div className = "news">
              {newsTemplate}
              < strong onClick = { this.allClick.bind(this) } className = { 'news__count  ' + ( data . length  > 0 ? '' : 'none' ) } > Всего  новостей : { data.length } </strong>
          </div>
    );
  }
}

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      news : my_news
    };
  }

  componentDidMount ( ) {
    var  self   = this ;
    window . ee . addListener ( 'News.add' , function ( item ) {
      var  nextNews   =  item . concat ( self . state . news ) ;
      self . setState ( { news :  nextNews } ) ;
    } ) ;
  }

  componentWillUnmount ( ) {
    window . ee . removeListener ( 'News.add' ) ;
  } 

  render() {
    return (
      <div  className = "app" >
          < Add  / >
          < h3 > Новости < / h3 >
          < News  data = { this . state . news } / >
      </div>
    );
  }
}

class Article extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      visible : false
    };
  }

  readmoreClick (e) {
    e . preventDefault ( ) ;
    this.setState({visible: true});
  }

  render() {
    var author = this.props.data.author, 
    text = this.props.data.text,
    bigText = this.props.data.bigText,
    visible  = this.state.visible; 

    return (
      <div  className = "article">
        <p  className = "news__author" > { author } : </p>
        <p  className = "news__text" > { text } </p>
        <a  href = "#" onClick = { this.readmoreClick.bind(this) } className= { 'news__readmore  ' + ( visible  ? 'none' : '' ) }> Подробнее </a>
        <p  className = { 'news__big-text ' + ( visible  ? '' : 'none' ) }>{ bigText } </p>
      </div>
    );
  }
}

class Add extends Component {
  constructor(props, context) {
    super(props, context);
    this.onBtnClickHandler = this.onBtnClickHandler.bind(this)
    this.onCheckRuleClick = this.onCheckRuleClick.bind(this)
    this.onFieldChange = this.onFieldChange.bind(this)

    this.state = {
      agreeNotChecked : true ,
      authorIsEmpty : true ,
      textIsEmpty : true 
    };
  }



  onBtnClickHandler () {
     var  textEl   =  ReactDOM . findDOMNode ( this . refs . text ) ;
     var  author   =  ReactDOM . findDOMNode ( this . refs . author ) . value ;
     var  text   =  textEl . value ;
     var  item   = [ {
        author :  author ,
        text :  text ,
        bigText : '...'
     } ] ;
    window . ee . emit ( 'News.add' ,   item ) ;
    textEl . value   = '' ;
    this . setState ( { textIsEmpty : true } ) ;
  }

  componentDidMount ( ) {
    ReactDOM . findDOMNode ( this . refs . author ) . focus ( ) ;
  } 

  onCheckRuleClick ( ) {
    this.setState ( {agreeNotChecked : !this.state.agreeNotChecked } ) ;
  }

  onFieldChange ( fieldName ,  e ) {
       if ( e . target . value . trim ( ) . length   > 0 ) {
           this . setState ( { [ '' + fieldName ] : false } )
       } else {
           this . setState ( { [ '' + fieldName ] : true } )
       }
  }

  render() {
    return (
                <form className = 'add  cf'>
                 <input
                    type = 'text'
                    className = 'add__author'
                    defaultValue={this.props.children}
                    placeholder = 'Ваше имя'
                    ref = 'author'
                    onChange = { this . onFieldChange . bind ( this , 'authorIsEmpty' ) }
                 />
                 <textarea
                    className = 'add__text'
                    defaultValue = ''
                    placeholder = 'Текст  новости'
                    ref = 'text'
                    onChange = { this . onFieldChange . bind ( this , 'textIsEmpty' ) }

                    ></textarea >
                 <label  className = 'add__checkrule'>
                  <input type = 'checkbox'   ref = 'checkrule'   onChange = { this . onCheckRuleClick }/> Я  согласен с правилами
                 </label >
                 <button
                    className = 'add__btn'
                    onClick = { this . onBtnClickHandler }
                    ref = 'alert_button' 
                    disabled = {this.state.agreeNotChecked || this.state.authorIsEmpty || this.state.textIsEmpty } >
                    Добавить  новость
                 </button>
                </form>
    );
  }
}

export default App;
