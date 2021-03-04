import React, { useState, useEffect } from 'react'
import PromotionCard from 'components/Promotion/Card/Card'
import axios from 'axios'

const PagesPromotionSearch = () => {
  const [promotions, setPromotions] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:5000/promotions?_embed=comments')
      .then(response => {
        setPromotions(response.data)
      })
  }, [])

  return (
    <div
      style={{
        maxWidth: 880,
        margin: '30px auto',
      }}
    >
      {promotions.map(promotion => (
        <PromotionCard promotion={promotion} />
      ))}
    </div>
  )
}

export default PagesPromotionSearch
