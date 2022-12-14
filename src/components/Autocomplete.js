import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import styles from './styles/Autocomplete.module.css'

const Autocomplete = ({ suggestions, output, renderInput, clearIcon }) => {
  const [isShow, setIsShow] = useState(false)
  const [active, setActive] = useState(0)
  const [filtered, setFiltered] = useState(suggestions)
  const inputRef = useRef(null)
  const containerRef = useRef(null)

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

  const handleClick = () => {
    setIsShow(true)
  }

  const handleClickSuggestion = (e) => {
    const input = e.currentTarget.innerText
    stateChange(input, false, 0)
  }

  const handleClear = () => {
    setFiltered(suggestions)
    output('')
  }

  const handleChange = (e) => {
    const input = e.target.value
    const isContained = suggestions.some((element) => {
      return element.toLowerCase() === input.toLowerCase()
    })
    isContained ? stateChange(input, false, 0) : stateChange(input, true, 0)
  }

  const handleKeyDown = (e) => {
    const keyCode = e.code
    switch (keyCode) {
      case 'Enter':
        e.preventDefault()
        if (filtered.length !== 0) {
          const input = filtered[active]
          stateChange(input, false, 0)
        }
        break
      case 'ArrowUp':
        setActive(!active ? 0 : active - 1)
        break
      case 'ArrowDown':
        setActive(active + 1 === filtered.length ? active : active + 1)
        break
      default:
        break
    }
  }

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

  const renderAutocomplete = () => {
    if (isShow && filtered.length > 0) {
      return (
        <ul className={styles.autocomplete}>
          {filtered.map((suggestion, index) => {
            return (
              <li
                className={index === active ? styles.active : ''}
                key={index}
                onClick={handleClickSuggestion}
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
    } else if (isShow && filtered.length === 0) {
      return (
        <div className={styles.noAutocomplete}>
          <em className={styles.absolute}>Not found</em>
        </div>
      )
    }
  }

  const params = {
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    onClick: handleClick,
  }

  useLayoutEffect(() => {
    containerRef.current.style.width = `${inputRef.current.offsetWidth}px`
  }, [inputRef])

  return (
    <div className={styles.container} ref={containerRef}>
      {renderInput(params, inputRef)}
      {clearIcon && (
        <span className={styles.clear} onClick={handleClear}>
          X
        </span>
      )}
      {renderAutocomplete()}
    </div>
  )
}

export default Autocomplete
