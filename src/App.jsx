import React, { useState } from 'react';
import { Container, TextField, Button, Box } from '@mui/material';
import AvatarEditor from 'react-avatar-editor';

function App() {
  var editor = "";
  const [name, setName] = useState('');
  const [furigana, setFurigana] = useState('');
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState({
    cropperOpen: false,
    img: null,
    zoom: 2,
    croppedImg:
      "https://pub-5c00d9cd767343259424b03f8a52941a.r2.dev/noimage.png"
  });
  const [scale, setScale] = useState(1.0); // 画像の拡大率
  const [noteError, setNoteError] = useState('');
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const handleImageChange = (e) => {
    let url = URL.createObjectURL(e.target.files[0]);
    setImage({
      ...image,
      img: url,
      cropperOpen: true
    });
  };
  const setEditorRef = (ed) => {
    editor = ed;
  };
  const handleSave = (e) => {
    if (setEditorRef) {
      const canvasScaled = editor.getImageScaledToCanvas();
      const croppedImg = canvasScaled.toDataURL();

      setImage({
        ...image,
        img: null,
        cropperOpen: false,
        croppedImg: croppedImg
      });
    }
  };

  const handleConfirmation = () => {
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

    if (!description) {
      setDescriptionError('概要は必須項目です.');
      return;
    } else {
      setDescriptionError('');
    }

    if (name && heading && description && image) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('furigana', furigana);
      formData.append('heading', heading);
      formData.append('description', description);
      fetch(image.croppedImg)
        .then(response => response.blob())
        .then(blob => {
          const fileExtension = image.croppedImg.split('.').pop(); // 拡張子を取得
          const fileName = 'cropped_image.' + fileExtension; // ファイル名を設定
          const fileType = fileExtension === 'jpg' ? 'image/jpeg' : 'image/png'; // フォーマットを設定
          const file = new File([blob], fileName, { type: fileType });
          formData.append('image', file);
        })
        .catch(error => {
          console.error('画像のダウンロード中にエラーが発生しました:', error);
        });
      formData.append('idToken', "todo");

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
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {image.cropperOpen && (
          <div>
            <AvatarEditor
              ref={setEditorRef}
              image={image.img}
              width={200} // 画像エディタの幅
              height={200} // 画像エディタの高さ
              border={10} // 画像エディタのボーダー
              scale={scale}
            />
            <div>
              <input
                type="range"
                min="1"
                max="2"
                step="0.01"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
              />
            </div>
            <button onClick={handleSave}>切り取る</button>
          </div>
        )}

        <Box width="35%">
          <img src={image.croppedImg} style={{ width: '200px', height: '200px' }} />
        </Box>


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
