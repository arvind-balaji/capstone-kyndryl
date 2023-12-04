import { useState, type FormEvent } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { read, utils } from 'xlsx';
const path = require('path');

export function UploadDocumentsForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<any>(null);

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const convertXlsx = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = read(data, { type: 'binary' });
  
          let allCsvData = '';
  
          const promises = workbook.SheetNames.map(async (sheetName, index) => {
            if (index > 0) {
              // Add a newline between sheets
              allCsvData += '\n';
            }
  
            const formData = new FormData();
            const csv = utils.sheet_to_csv(workbook.Sheets[sheetName]);
            await formData.append('file', new Blob([csv], { type: 'text/csv' }), file.name + '_converted.csv');
  
            await axios.post('/api/retrieval/file_ingest', formData)
              .then(res => {
                console.log(res);
              })
              .catch(er => {
                console.log(er);
              });
  
            allCsvData += csv;
          });
  
          Promise.all(promises)
            .then(() => {
              resolve(allCsvData);
            })
            .catch((error) => {
              reject(error);
            });
        } catch (error) {
          reject(error);
        }
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      reader.readAsBinaryString(file);
    });
  };
  const ingest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const fileExtension = path.extname(file.name);
    if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      try {
        const csvData = await convertXlsx(file);
        await alert('Document uploaded successfully');
        await router.push('/retrieval');
        setFile(null);
      } catch (error) {
        console.log('Error converting to csv:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      const formData = new FormData()
      formData.append('file', file);
    // formData.append('chunkSize', String(process.env.NEXT_PUBLIC_CHUNK_SIZE));
      axios.post('/api/retrieval/file_ingest', formData)
      .then( res => {
        console.log(res);
        alert("Document uploaded successfully");
        router.push("/retrieval");
        setFile(null);
        setIsLoading(false);
      })
      .catch(er => {
        console.log(er);
        setFile(null);
        setIsLoading(false);
      });
    }
  };
  
  return (
    <form onSubmit={ingest} encType="multipart/form-data" className="flex justify-center w-full mb-4" method="POST">
      <input type="file" onChange={handleFileChange} className='grow mr-8 p-2 bg-white rounded' name="file"/>
      <button type="submit" className="shrink-0 px-8 py-4 bg-[#fb442c] rounded w-28" disabled={file == null || isLoading}>
        {isLoading? (<div role="status" className={`${(isLoading) ? "" : "hidden"} flex justify-center`}>
          <svg
            aria-hidden="true"
            className="w-6 h-6 text-white animate-spin dark:text-white fill-sky-800"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg> 
          <span className="sr-only">Loading...</span> 
        </div>) :
        <span className={(isLoading) ? "hidden" : ""}>Upload</span> }
      </button>
    </form>
  );
}