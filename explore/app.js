var ElUpdater = Updater.ElementUpdater

//var wordnet = new natural.WordNet();
/*
wordnet.lookup('node', function(results) {
    results.forEach(function(result) {
        console.log('------------------------------------');
        console.log(result.synsetOffset);
        console.log(result.pos);
        console.log(result.lemma);
        console.log(result.synonyms);
        console.log(result.pos);
        console.log(result.gloss);
    });
});
*/
var input = makeComponent({
  tag: 'input',
  placeholder: 'type whatever you want',
  className: 'primary-input'
})

var inputText = new Variable()
var outputContents = new Variable()
var output = makeComponent({
  tag: 'div',
  className: 'primary-output'
})

init()

function init () {
  new ElUpdater({
    variable: inputText,
    element: output,
    renderUpdate: function (text) {
      console.log(text, output)
      output.innerHTML = text
    }
  })
  $(input).on('keydown', () => inputText.put(input.value))
}

function makeComponent (opts) {
  let node = document.createElement(opts.tag ? opts.tag : 'div')
  if(opts.id) {
    node.id = opts.id
  }
  if(opts.className) {
    node.className = opts.className
  }
  if(opts.name) {
    node.name = opts.name
  }
  if(opts.placeholder) {
    node.placeholder = opts.placeholder
  }
  if(opts.html) {
    node.innerHTML = opts.html
  }
  if(opts.text) {
    node.textContent = opts.text
  }
  let parent = opts.parent ? opts.parent : document.body
  console.log('Created node:', node)
  parent.appendChild(node)
  return node
}

const CONVERSATION_PATH = {
  '1': {
    text: '1',
    '1.1': {
      text: '1',
      '1.1.1': ''
    }
  },
  '2': {
    text: '2',
    '2.1': {
      text: '2',
      '2.1.1': ''
    }
  }
}