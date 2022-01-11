import { useState, useEffect } from 'react'
import './App.css'
import Image from './components/Image'

function App () {
  const [images, setImages] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('http://localhost:3000/images')
      .then(resp => resp.json())
      .then(imagesFromServer => setImages(imagesFromServer))
  }, [])

  function likeImage (image) {
    // update the server
    fetch(`http://localhost:3000/images/${image.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ likes: image.likes + 1 })
    })

    // update state
    const updatedImages = JSON.parse(JSON.stringify(images))
    const match = updatedImages.find(target => target.id === image.id)
    match.likes++
    setImages(updatedImages)
  }

  return (
    <div className='App'>
      <img className='logo' src='assets/hoxtagram-logo.png' />

      <div>
        <h2>Search for images</h2>
        <input
          type='text'
          placeholder='enter your search here'
          onChange={e => {
            setSearch(e.target.value)
          }}
        />
      </div>

      <div>
        <h2>Add an image</h2>
        <form
          onSubmit={e => {
            e.preventDefault()
            console.log('title: ', e.target.title.value)
            console.log('url:', e.target.url.value)
            e.target.reset()
          }}
        >
          <input type='text' placeholder='title' name='title' />
          <input type='text' placeholder='url' name='url' />
          <button>ADD IMAGE</button>
        </form>
      </div>

      <section className='image-container'>
        {images.map(image => (
          <Image key={image.id} image={image} likeImage={likeImage} />
        ))}
      </section>
    </div>
  )
}

export default App
