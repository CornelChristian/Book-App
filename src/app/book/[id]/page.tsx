"use client"
import { books } from "@/constants/mockData"
import '@fortawesome/fontawesome-free/css/all.min.css'
import { motion } from 'framer-motion'
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Editor, useDomValue } from "reactjs-editor"
import styles from './book.module.css'

export default function BookPage() {
   const { id } = useParams()
   const router = useRouter()

   const { dom, setDom } = useDomValue();

   const selectedBook = books.filter((book) => id === String(book.id))
   const notify = () => toast("Your changes have been saved!");

   const handleSave = () => {
      const updatedDomValue = {
         key: dom?.key,
         props: dom?.props,
         ref: dom?.ref,
         type: dom?.type,
      }

      localStorage.setItem(`dom${selectedBook[0].id}`, JSON.stringify(updatedDomValue))
      notify()
   }

   useEffect(() => {
      const savedDom = localStorage.getItem(`dom${selectedBook[0].id}`)
      if (savedDom) {
         setDom(JSON.parse(savedDom))
      }
   }, []) // eslint-disable-line react-hooks/exhaustive-deps

   const handleBack = () => {
      router.back() // Navigate back to the previous page
   }

   if (!selectedBook.length) return <p>Book not found</p>

   return (
      <motion.div transition={{ type: 'spring', damping: 40, mass: 0.75 }}
         initial={{ opacity: 0, x: 1000 }} animate={{ opacity: 1, x: 0 }}>
         <motion.section transition={{ type: 'spring', damping: 44, mass: 0.75 }}
            initial={{ opacity: 0, y: -1000 }} animate={{ opacity: 1, y: 0 }} className={styles.appBar}>
            <div className={styles.leftIcons}>
               <i
                  style={{ fontSize: '20px', cursor: 'pointer' }}
                  className="fas fa-chevron-left"
                  onClick={handleBack} // Added event listener
               ></i>
            </div>
            <div className={styles.title}>
               <h2 className={styles.titleStyles}>{selectedBook[0].title}</h2>
            </div>
            <div className={styles.icons}>
               <button className={styles.saveButton} onClick={handleSave}>Save</button>
            </div>
         </motion.section>

         <Editor
            htmlContent={`
               <main className="bookContainer">
                  <aside>
                     <h1 className="center">${selectedBook[0].title} </h1>
                     <span className="center small"> By ${selectedBook[0].author} </span>
                     ${selectedBook[0].content}
                  </aside>
               </main>
            `}
         />
         <ToastContainer />
      </motion.div>
   )
}
