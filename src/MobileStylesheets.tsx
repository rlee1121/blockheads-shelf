import "./mobile.css"

// This is a hack to get mobile.css to show up at the end so that 
// the styles can take priority from css that isn't in a media query
// since css will give two selectors of equal priority a win to the last one.
export default function MobileStylesheets() {return null}