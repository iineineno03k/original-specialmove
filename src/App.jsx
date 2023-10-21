import React, { useState } from 'react';
import { Container, TextField, TextareaAutosize, Button, Box } from '@mui/material';

function App() {
  const [name, setName] = useState('');
  const [furigana, setFurigana] = useState('');
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [noteError, setNoteError] = useState('');
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [imageError, setImageError] = useState('');

  const handleConfirmation = () => {
    if (!name) {
      setNameError('名前は必須項目です.');
      return;
    } else {
      setNameError('');
    }

    if (!heading) {
      setNoteError('ひとことは必須項目です.');
      return;
    } else {
      setNoteError('');
    }

    if (!description) {
      setDescriptionError('概要は必須項目です.');
      return;
    } else {
      setDescriptionError('');
    }

    if (!image) {
      setImageError('写真は必須項目です.');
      return;
    } else {
      setImageError('');
    }

    if (name && heading && description && image) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('furigana', furigana);
      formData.append('heading', heading);
      formData.append('description', description);
      formData.append('image', image);

      fetch('http://localhost:8080/regist', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          // APIの応答を処理
          if (response.ok) {
            console.log("成功");
          } else {
            console.log("失敗");
          }
        })
        .catch((error) => {
          // エラーハンドリング
          console.error('APIエラー:', error);
        });
    }
  };

  return (
    <Container maxWidth="xs">
      <h1>必殺技フォーム！！！</h1>
      <form>
        <TextField
          label="名前"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!nameError}
          helperText={nameError}
        />
        <br />
        <TextField
          label="ふりがな"
          fullWidth
          value={furigana}
          onChange={(e) => setFurigana(e.target.value)}
        />
        <br />
        <TextField
          label="ひとこと"
          fullWidth
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          error={!!noteError}
          helperText={noteError}
        />
        <br />
        <TextField
          rowsMin={3}
          placeholder="概要"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={!!descriptionError}
          helperText={descriptionError}
        />
        <br />
        <input
          type="file"
          onChange={(e) => {
            setImage(e.target.files[0]);
            setImageError('');
          }}
        />
        {imageError && (
          <p style={{ color: 'red' }}>{imageError}</p>
        )}
        <br />
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleConfirmation}>
            確認
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default App;
