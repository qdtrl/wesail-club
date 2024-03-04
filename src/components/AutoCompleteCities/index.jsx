import { Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './index.scss'

const AutoCompleteCities = ({ setAddress, quotation }) => {
    const [ addresses, setAddresses] = useState([])
	const [ addresse, setAddresse] = useState("")


	useEffect(()=>{
		if(addresse.length > 3) {
			const url = new URL('https://api-adresse.data.gouv.fr/search')
			const params = {q: addresse}
			Object.keys(params).forEach(
				key => url.searchParams.append(key, params[key])
			)
			fetch(url)
			.then(response => {
				if (response.status >= 200 && response.status < 300) {
				  return response
				} else {
				  const error = new Error(response.statusText)
				  error.response = response
				  throw error
				}
			  })
			  .then(response => response.json())
			  .then(data => {
				  if (data.features) {
					setAddresses(data.features.map((address) => {
						return {
							address: address.properties.name,
							city: address.properties.city,
							zipcode: address.properties.postcode,
							label: address.properties.label,
						}
					}))
				  }	
				})
			  .catch(error => console.log('request failed', error))
		} else {
			setAddresses([])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[addresse])

    return (
    <Stack position='relative'>
        <TextField
            name="autocomplete"
            label="Recherche par Adresse, Ville (Code Postal)"
            style={{ zIndex: '101' }}
            value={addresse}
            onChange={(e) => setAddresse(e.target.value)}
        />
        { addresses.length > 0 && 
        <Stack style={{ position: 'absolute', top: 60, width: '100%'}}>
            { addresses.map((addres, index) => (
                <Typography p={1} key={index} onClick={() => { 
                    setAddress(prev => {
                        return {
                        ...prev,
                        city: addres?.city?.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()),
                        address: addres?.address?.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()),
                        zipcode: addres?.zipcode
                        }
                    })
                    setAddresses([])
            }}
                className='autocomplete_address'
                >
                    {addres.address}, {addres.city} ({addres.zipcode})
                </Typography>
            ))}
        </Stack>}
    </Stack>
  )
}

export default AutoCompleteCities