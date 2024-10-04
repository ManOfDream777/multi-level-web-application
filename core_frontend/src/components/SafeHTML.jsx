import DOMPurify from 'dompurify'

function SafeHTML({body}) {
    const cleaned_body = DOMPurify.sanitize(body)
    return <div dangerouslySetInnerHTML={{__html: cleaned_body}}/>
}

export default SafeHTML