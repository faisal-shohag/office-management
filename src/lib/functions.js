const generateLetter = (input) => {
    const words = input.split(/\s+/);
    if(words.length > 1) {
        let nemonic = words.map(word=> {
            return word[0]
        })
        return nemonic.join('').toUpperCase()
    }
      return (words[0][0]+words[0][1]).toUpperCase()
  }
  


  export {generateLetter}