 
import { useEffect, useState } from 'react';
import './App.css';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import CreateFile from './components/CreateFile';
import CreateFolder from './components/CreateFolder';
import Stack from '@mui/material/Stack';
import { Breadcrumbs } from '@mui/material';
import FolderOpen from '@mui/icons-material/FolderOpen';

import mockData from './mockData.json';

import { TreeItem } from './models/treeItem'
import FileContent from './components/FileContent';

const App = () => {
  const [unfilteredData, setUnfilteredData] = useState<TreeItem[]>([])
  const [data, setData] = useState<TreeItem[]>([]);
  const [parentIndex, setParentIndex] = useState(0);
  const [history, setHistory] = useState([0]);
  const [breadcrumbs, setBreadCrumbs] = useState([''])

  useEffect(() => {
    const storage = localStorage.getItem('dataKey')
    if (storage) {
      const items: TreeItem[] = JSON.parse(storage);
      setUnfilteredData([...items])
      //
      setData([...items])
      setHistory([0])
      setBreadCrumbs([items[0].name])
    } else {
      setUnfilteredData([...mockData])
      setData([...mockData])
      setHistory([0])
      setBreadCrumbs([mockData[0].name])
    }
  },[])

  const folders = data.filter(item => {
    if (item.parentIndex === parentIndex || parentIndex === -1000) {
      if (item.type === 'folder') {
        return true;
      }
    }
    return false;
  })

  const files = data.filter(item => {
    if (item.parentIndex === parentIndex || parentIndex === -1000) {
      if (item.type === 'file') {
        return true;
      }
    }
    return false;
  });

  const handleFolderOpen = (folder: TreeItem) => {
    setParentIndex(folder.index);
    const newHistory = [...history, folder.index];
    setHistory(newHistory);
    //
    // set breadcrumbs
    const newBreadcrumbs = [...breadcrumbs, folder.name]
    setBreadCrumbs(newBreadcrumbs)
  }

  const handleFileOpen = (file: TreeItem) => {
    
  }

  const handleGoBack = () => {
    if (history.length && history.length === 1) {
      return;
    }
    const idx = history.length - 2;
    setParentIndex(history[idx]);

    const newHistory = [...history];
    newHistory.pop();
    setHistory(newHistory);
    //
    // set breadcrumbs
    const newBreadcrumbs = [...breadcrumbs];
    newBreadcrumbs.pop()
    setBreadCrumbs(newBreadcrumbs)
  }

  const handleNewFolder = (name: string) => {
    // check for null folder
    if (name === "") {
      return;
    }
    // check for existing folder
    const existingNameArray = folders.filter(
      element => element.name.toLowerCase().indexOf(name.toLowerCase()) >= 0
    );

    if (existingNameArray.length > 0) {
      alert('an item with that name already exists')
      return;
    }
    const item = {
      parentIndex: parentIndex,
      index: data.length,
      name: name,
      type: 'folder'
    }
    const newData = [...data, item];
    setData(newData);
    localStorage.setItem('dataKey', JSON.stringify(newData));
    setUnfilteredData(newData);
  }

  const handleNewFile = (name: string, content: string) => {
    // check for null file
    if (name === "") {
      return;
    }
    // check for existing file
    const existingNameArray = files.filter(
      element => element.name.toLowerCase().indexOf(name.toLowerCase()) >= 0
    );

    if (existingNameArray.length > 0) {
      alert('an item with that name already exists')
      return;
    }

    const item = {
      parentIndex: parentIndex,
      index: data.length,
      name: name,
      type: 'file',
      content: content
    }
    const newData = [...data, item];
    setData(newData);
    localStorage.setItem('dataKey', JSON.stringify(newData));
    setUnfilteredData(newData);
  }

  const search = (s: string) => {
    // set breacrumbs to initial values
    setBreadCrumbs([unfilteredData[0].name])
    setHistory([0])
    if (s === '') {
      setParentIndex(0) // reset to root directory on empty string
    } else {
      setParentIndex(-1000) // index of -1000 sets folder/file to display all and not just those in
                            // a folder
    }
    let filteredData = unfilteredData.filter(
      element => (element.name.toLowerCase().indexOf(s.toLowerCase()) >= 0) ||
        (element.content && element.content.toLowerCase().indexOf(s.toLowerCase()) >= 0)
    );
    setData(filteredData);
  }

  return (
    <Container sx={{ width: 855, height: '100vh'}}>
      <Stack direction="column" sx={{height: "100%"}}>
        <Box marginY={2}>
          <TextField 
            size="small" 
            fullWidth  
            id="search" 
            placeholder='Search...'
            onChange={e => search(e.target.value)}
          />
        </Box> 
        <Box>
          <Stack direction="row" spacing={2} marginBottom={2}>
            { /* do not allow file/folder creation when searching */ }
            { parentIndex !== -1000 && 
              <>
                <CreateFile callback={handleNewFile} />
                <CreateFolder callback={handleNewFolder} />
              </>
            }
          </Stack>
        </Box>
        <Box marginY={2}>
          <Stack direction="row" justifyContent="space-between">
            <Breadcrumbs aria-label="breadcrumb">
              { breadcrumbs.map((name, index) => <Typography key={index}>{ name }</Typography>) }
            </Breadcrumbs>
            <Typography 
              onClick={handleGoBack} 
              sx={{"&:hover": {color: 'gray', cursor: 'pointer'}}}
            >
              Back
            </Typography>
          </Stack>
        </Box>
      
        <Paper variant="outlined" sx={{flex: 1}}>
          <Box sx={{display: 'flex', flexWrap: 'wrap', maxWidth: "100%"}}>
          { folders.map((folder, index) => {
              return (
                <Stack key={index} alignItems="center" justifyContent="center" style={{width: 100, height: 100}}>
                  <Box 
                    onDoubleClick={e => handleFolderOpen(folder)}
                    sx={{ textAlign: "center", pt: 1, width: "80%", fontSize: 50, borderRadius: 1, "&:hover": {backgroundColor: 'lightblue', cursor: 'pointer'}}}>
                    <FolderOpen sx={{ fontSize: 50 }}/>
                  </Box> 
                  <Typography variant="subtitle2">{folder.name}</Typography>
                </Stack>
              )
            }) 
          }
          { files.map((file, index) => <FileContent file={file} key={index} />) }   
          </Box>
        </Paper>
        
        <Box marginTop={2} marginBottom={5}>
          <Typography align="right">
            Total: {files && files.length} files and {folders && folders.length} folders
          </Typography>
        </Box>
      </Stack>
    </Container>   
  );
}

export default App;
