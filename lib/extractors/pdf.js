var path = require( 'path' )
  , exec = require( 'child_process' ).exec
  , extract = require( 'pdf-parse' )
  , fs = require('fs')
  ;

function extractText( filePath, options, cb ) {
  // See https://github.com/dbashford/textract/issues/75 for description of
  // what is happening here
  var pdftotextOptions = options.pdftotextOptions || { layout: 'raw' };
  const dataBuffer = fs.readFileSync(filePath)
  extract( dataBuffer ).then(function( data ) {
    var fullText;
    fullText = data.text.trim();
    cb( null, fullText );
  }).catch(function(error) {
    if ( error ) {
      error = new Error( 'Error extracting PDF text for file at [[ ' +
        path.basename( filePath ) + ' ]], error: ' + error.message );
      cb( error, null );
      return;
    }
  })
}

function testForBinary( options, cb ) {
  // exec( 'pdftotext -v',
  //   function( error, stdout, stderr ) {
  //     var msg;
  //     if ( stderr && stderr.indexOf( 'pdftotext version' ) > -1 ) {
  //       cb( true );
  //     } else {
  //       msg = 'INFO: \'pdftotext\' does not appear to be installed, ' +
  //        'so textract will be unable to extract PDFs.';
  //       cb( false, msg );
  //     }
  //   }
  // );
  cb(true);
}

module.exports = {
  types: ['application/pdf'],
  extract: extractText,
  test: testForBinary
};
