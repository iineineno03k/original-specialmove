import React, { useEffect, useState, useRef } from 'react';
import { Container, TextField, Button, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import AvatarEditor from 'react-avatar-editor';
import liff from '@line/liff';
import { TailSpin } from 'react-loader-spinner';
import SpecialMoveCard from './component/SpecialMoveCard';
import "./App.css";

// テーマのカスタマイズ
const theme = createTheme({
  palette: {
    primary: {
      light: '#63a4fff',
      main: '#1976d2',
      dark: '#004ba0',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: [
      'Roboto', 'Helvetica', 'Arial', 'sans-serif'
    ].join(','),
    h5: {
      fontWeight: 700,
      marginBottom: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
          margin: '8px',
          fontSize: '1rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '1rem',
        },
      },
    },
  },
});

function App() {
  var editor = "";
  const [name, setName] = useState('必殺技名');
  const [furigana, setFurigana] = useState('');
  const [heading, setHeading] = useState('ひとこと');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState({
    cropperOpen: false,
    img: null,
    zoom: 2,
    croppedImg:
      "https://pub-5c00d9cd767343259424b03f8a52941a.r2.dev/noimage.png"
  });
  const [idToken, setIdToken] = useState('');
  const [scale, setScale] = useState(1.0); // 画像の拡大率
  const [noteError, setNoteError] = useState('');
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    // liff関連のlocalStorageのキーのリストを取得
    const getLiffLocalStorageKeys = (prefix) => {
      const keys = []
      for (var i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.indexOf(prefix) === 0) {
          keys.push(key)
        }
      }
      return keys
    }
    // 期限切れのIDTokenをクリアする
    const clearExpiredIdToken = (liffId) => {
      const keyPrefix = `LIFF_STORE:${liffId}:`
      const key = keyPrefix + 'decodedIDToken'
      const decodedIDTokenString = localStorage.getItem(key)
      if (!decodedIDTokenString) {
        return
      }
      const decodedIDToken = JSON.parse(decodedIDTokenString)
      // 有効期限をチェック
      if (new Date().getTime() > decodedIDToken.exp * 1000) {
        const keys = getLiffLocalStorageKeys(keyPrefix)
        keys.forEach(function (key) {
          localStorage.removeItem(key)
        })
      }
    }
    const initializeLiff = async (id) => {
      clearExpiredIdToken(id)
      await liff.init({ liffId: id })
      if (!liff.isLoggedIn()) {
        liff.login();
      } else {
        const token = liff.getIDToken()
        setIdToken(token);
      }
    }
    initializeLiff('2001116233-KA7Znp4R');
  }, []);

  const handleImageChange = (e) => {
    let url = URL.createObjectURL(e.target.files[0]);
    setImage({
      ...image,
      img: url,
      cropperOpen: true
    });
  };

  const handleSave = () => {
    if (editorRef.current) {
      const canvasScaled = editorRef.current.getImageScaledToCanvas();
      const croppedImg = canvasScaled.toDataURL();

      setImage({
        ...image,
        img: null,
        cropperOpen: false,
        croppedImg: croppedImg
      });
    }
  };

  const handleConfirmation = async () => {
    if (image.cropperOpen) {
      //切り取り中にAPIを走らせない。→強制で200×200にさせる
      return;
    }

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

    // if (heading.length > 15) {
    //   setNoteError('ひとことは15文字までです.')
    //   return;
    // } else {
    //   setNoteError('');
    // }

    if (!description) {
      setDescriptionError('概要は必須項目です.');
      return;
    } else {
      setDescriptionError('');
    }

    setLoading(true);

    if (name && heading && description && image) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('furigana', furigana);
      formData.append('heading', heading);
      formData.append('description', description);
      var file;
      await fetch(image.croppedImg)
        .then(response => response.blob())
        .then(blob => {
          file = new File([blob], "sample.png", { type: blob.type })
        })
      formData.append('image', file);
      formData.append('idToken', idToken);

      fetch('https://original-specialmove.onrender.com/regist', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          // APIの応答を処理
          if (response.ok) {
            setLoading(false);
            liff.closeWindow();
          } else {
            setLoading(false);
            liff.closeWindow();
          }
        })
        .catch((error) => {
          console.error('APIリクエストエラー', error);
          setLoading(false);
          liff.closeWindow();
        });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false}>
        {loading && (
          <div className="overlay">
            <TailSpin
              height={80}
              width={80}
              color="#4fa94d"
              ariaLabel="tail-spin-loading"
              radius={1}
              visible={true}
            />
          </div>
        )}
        <Typography variant="h5" align="center" color="primary" sx={{ mt: 2 }}>
          必殺技フォーム
        </Typography>
        <SpecialMoveCard
          name={name}
          furigana={furigana}
          heading={heading}
          description={description}
          croppedImg={image.croppedImg}
        />
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
            multiline
            placeholder="概要"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={!!descriptionError}
            helperText={descriptionError}
          />
          <br />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <Dialog
            open={image.cropperOpen}
            maxWidth="lg"
            fullWidth
            aria-labelledby="image-cropper-dialog"
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              padding={2}
              minHeight={300}
            >
              {image.img && (
                <AvatarEditor
                  ref={editorRef}
                  image={image.img}
                  width={200}
                  height={200}
                  border={10}
                  scale={scale}
                />
              )}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                marginTop={2}
              >
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.01"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                />
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                marginTop={2}
              >
                <Button variant="contained" color="primary" onClick={handleSave}>
                  切り取る
                </Button>
              </Box>
            </Box>
          </Dialog>
          <Box mt={2} textAlign={"right"} >
            <Button variant="contained" color="primary" onClick={handleConfirmation} disabled={loading}>
              登録
            </Button>
          </Box>
        </form>
      </Container >
    </ThemeProvider>
  );
}

export default App;
