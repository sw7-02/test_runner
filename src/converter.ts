import { appendFile } from 'node:fs';


interface opgave {
    kode: string;
    sprog: string;
	exerciseID: string;
}

interface tests {
	kode: string;
}

//let opg: opgave = JSON.parse(opgFile.json); indsæt de rigtige navne
//let test: tests = JSON.parse(testFile.json);

appendFile(`opgaveFile.${opg.sprog}`, `${opg.kode}`, 'utf8', function (err) {
  if (err) {
    console.log(err)
    // append failed
  } else {
    console.log(`opgaveFile.${opg.sprog} was appended!`)
    // done
  }
});

appendFile(`testFile.${opg.sprog}`, `${test.kode}`, 'utf8', function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log(`testFile.${opg.sprog} was appended!`)
  }
});