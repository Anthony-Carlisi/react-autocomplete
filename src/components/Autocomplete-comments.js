// Dependencies Imports
import { useState, useRef, useEffect, useLayoutEffect } from 'react'
// Styles
import styles from './styles/Autocomplete.module.css'

const Autocomplete = ({ suggestions, output, renderInput, clearIcon }) => {
  // State of the drop down menu
  const [isShow, setIsShow] = useState(false)
  // Tracks which value is active on keypress
  const [active, setActive] = useState(0)
  // filters suggestions on load
  const [filtered, setFiltered] = useState(suggestions)
  // Creates ref for input to close when not selected
  const inputRef = useRef(null)

  const containerRef = useRef(null)
  // handles outside clicks for input field to close suggestions
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsShow(false)
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [])

  // on Text change drop down is displayed the value is set to the change text and active is reset
  const handleChange = (e) => {
    const input = e.target.value
    // check if input value exactly matches a suggestions
    const isContained = suggestions.some((element) => {
      return element.toLowerCase() === input.toLowerCase()
    })
    isContained ? stateChange(input, false, 0) : stateChange(input, true, 0)
  }

  // on input field focus click all values are displayed
  const handleClick = () => {
    setIsShow(true)
  }

  // on suggestion click value is set to the value of the drop down and drop down is set to hidden
  const handleClickSuggestion = (e) => {
    const input = e.currentTarget.innerText
    stateChange(input, false, 0)
  }

  // Controlls keypresses on autocomplete
  const handleKeyDown = (e) => {
    const keyCode = e.code
    switch (keyCode) {
      case 'Enter':
        e.preventDefault()
        // Error check if filtered has a suggestion
        if (filtered.length !== 0) {
          const input = filtered[active]
          stateChange(input, false, 0)
        }
        break
      case 'ArrowUp':
        // Sets Active in current list
        setActive(!active ? 0 : active - 1)
        break
      case 'ArrowDown':
        setActive(active + 1 === filtered.length ? active : active + 1)
        break
      default:
        break
    }
  }

  // Function that controls the states of autocomplete
  const stateChange = (input, isShow, active) => {
    setFiltered(
      suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().indexOf(input.toLowerCase()) > -1
      )
    )
    setActive(active)
    setIsShow(isShow)
    output(input)
  }

  // Function that renders the suggestions or not found
  const renderAutocomplete = () => {
    // if drop down is shown and suggestions are not empty
    if (isShow && filtered.length > 0) {
      return (
        <ul className={styles.autocomplete}>
          {filtered.map((suggestion, index) => {
            return (
              <li
                // conditional logic for which suggestion is active
                className={index === active ? styles.active : ''}
                key={index}
                onClick={handleClickSuggestion}
                // Scroll element that is active into view
                ref={(el) =>
                  index === active &&
                  el !== null &&
                  el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                  })
                }
                onMouseEnter={() => setActive(index)}
              >
                {suggestion}
              </li>
            )
          })}
        </ul>
      )
      // if drop down is active and no suggestions
    } else if (isShow && filtered.length === 0) {
      return (
        <div className={styles.noAutocomplete}>
          <em className={styles.absolute}>Not found</em>
        </div>
      )
    }
  }

  // Clears the input field
  const handleClear = () => {
    setFiltered(suggestions)
    output('')
  }
  // Passes all events to params object to pass to input field
  const params = {
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    onClick: handleClick,
  }

  // Force content width to match the width of the input passed through the params
  useLayoutEffect(() => {
    // offsetWidth is used so if width is not passed still obtains elements width
    containerRef.current.style.width = `${inputRef.current.offsetWidth}px`
  }, [inputRef])

  // Renders input field and suggestion drop down wrapper
  return (
    <div className={styles.container} ref={containerRef}>
      {/* Renders input */}
      {renderInput(params, inputRef)}
      {/* Renders  Clear Element*/}
      {clearIcon && (
        <span className={styles.clear} onClick={handleClear}>
          X
        </span>
      )}
      {/* Renders Drop down */}
      {renderAutocomplete()}
    </div>
  )
}

export default Autocomplete
