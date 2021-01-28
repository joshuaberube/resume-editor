import { useState } from 'react'
import { PDFDocument } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"

const App = () => {
  const [pdf, setPDF] = useState()
  const [font, setFont] = useState()
  const [companyName, setCompanyName] = useState("")
  const [jobPosition, setJobPosition] = useState("")
  const [savedPDF, setSavedPDF] = useState(false)
  const [isTooLong, setIsTooLong] = useState(false)

  const fieldParagraph = `I'm a web developer looking for ${isTooLong ? 'a' : `the ${jobPosition}`} position at ${companyName}. I'm a fast learner, self-starter, good communicator, and problem solver ready to solve your problems. I write maintainable, quality, and code so clear that your mom could read it. Oh yeah, I'm also a Stack Overflow expert.`

  const onSubmitHandler = async e => {
    e.preventDefault()
    const convertPDFToArrayBuffer = await pdf.arrayBuffer()
    const pdfDoc = await PDFDocument.load(convertPDFToArrayBuffer)
    pdfDoc.registerFontkit(fontkit)
    const test2 = await font.arrayBuffer()
    const proximaNovaRg = await pdfDoc.embedFont(test2)

    pdfDoc.setTitle(`${companyName} Resume`)
    pdfDoc.setSubject("Josh Berube's Resume")

    const profileField = pdfDoc.getForm().getTextField("profile")

    if (fieldParagraph.length > 300) setIsTooLong(true)

    profileField.setText(fieldParagraph)
    profileField.enableMultiline()
    profileField.enableReadOnly()
    profileField.updateAppearances(proximaNovaRg)

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], {type: "application/pdf"})
    const url = URL.createObjectURL(blob)
    setSavedPDF(url)
  }

  return (
    <div>
      <h1>Hello!</h1>
      <form onSubmit={onSubmitHandler}>
        <fieldset>
          <legend>Modify PDF</legend>
          <input type="file" onChange={e => setPDF(e.target.files[0])} />
          <input type="file" onChange={e => setFont(e.target.files[0])} />
          <input type="text" value={companyName} placeholder="Company Name" onChange={e => setCompanyName(e.target.value)} />
          <input type="text" value={jobPosition} placeholder="Job Position" onChange={e => setJobPosition(e.target.value)} />
          <button type="submit">Modify PDF</button>
        </fieldset>
      </form>
      {savedPDF ? <a href={savedPDF} download={`${companyName} Resume`} target="_blank" rel="noreferrer">Download modified PDF</a> : null}
    </div>
  )
}

export default App