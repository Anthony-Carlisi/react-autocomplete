import Autocomplete from './components/Autocomplete'
import { useState } from 'react'

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const App = () => {
  const [value, setValue] = useState('')

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', marginTop: '300px' }}
    >
      <Autocomplete
        output={(e) => setValue(e)}
        suggestions={months}
        clearIcon={true}
        renderInput={(params, ref) => (
          <input
            {...params}
            ref={ref}
            style={{
              width: '200px',
              borderRadius: '10px',
              height: '20px',
              paddingLeft: '10px',
            }}
            placeholder={'Search and select month'}
            type='text'
            value={value}
          />
        )}
      />
    </div>
  )
}

export default App
