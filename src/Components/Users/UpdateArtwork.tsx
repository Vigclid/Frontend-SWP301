import React, { useState, useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Autocomplete, TextField, Chip } from "@mui/material";
import CustomizedButton from "../StyledMUI/CustomizedButton.tsx";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import CustomizedTextField from "../StyledMUI/CustomizedTextField.tsx";
import CustomizedSwitch from "../StyledMUI/CustomizedSwitch.jsx";
import CustomizedTypography from "../StyledMUI/CustomizedTypography.jsx";
import CustomizedImageButton from "../StyledMUI/CustomizedImageButton.jsx";
import * as Yup from "yup";
import { useFormik, FieldArray, FormikProvider } from "formik";
import axios from "axios";
import { Tag } from "../../Interfaces/TagInterface.ts";
import { GetTagList } from "../../API/TagAPI/GET.tsx";
import { Creator } from "../../Interfaces/UserInterface.ts";
import { useNavigate, useParams } from "react-router-dom";
import { Artwork } from "../../Interfaces/ArtworkInterfaces.ts";
import { FormControlLabel } from "@mui/material";
import { GetArtById } from "../../API/ArtworkAPI/GET.tsx";
import { GetTagByArtId } from "../../API/TagAPI/GET.tsx";
function UpdateArtwork() {
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);

  const [preview, setPreview] = useState<string>("");
  const [priceSwitch, setPriceSwitch] = useState(false);
  const [listOfTags, setListOfTags] = useState<Tag[] | undefined>([]);
  const [blobImage, setBlobImage] = useState();
  const { artworkID } = useParams();
  const navigate = useNavigate();
  const url = `${process.env.REACT_APP_API_URL}/artworks/update`; // GET & PUT theo id

  // Giả sử thông tin người dùng được lưu trong sessionStorage
  const authData = sessionStorage.getItem("auth");
  const user: Creator = authData ? JSON.parse(authData) : null;
  //Get tagList

  useEffect(() => {
    const tagList = async () => {
      let tagList: Tag[] | undefined = await GetTagList();
      setListOfTags(tagList);
    };
    tagList();
  }, []);

  // Hàm chuyển Blob sang Base64
  function blobToBase64(blob, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      const base64data = reader.result;
      callback(base64data);
    };
  }

  // Xử lý thay đổi hình ảnh
  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (name === "imageFile") {
      const file = files[0];
      setBlobImage(file);
      blobToBase64(file, function (base64Image) {
        setPreview(base64Image);
      });
    }
  };

  // Xử lý thay đổi switch giá
  const handleSwitchChange = (e) => {
    setPriceSwitch(e.target.checked);
    // Cập nhật luôn giá trị purchasable trong formik
    formik.setFieldValue("purchasable", e.target.checked);
  };

  // Hiển thị trường giá nếu có thể mua
  const handlePriceVisibility = () => {
    return (
      priceSwitch && (
        <div className="priceField">
          <CustomizedTextField
            sx={{ float: "right" }}
            name="price"
            label="Price *1000 (Unit is VND)"
            value={formik.values.price}
            onChange={formik.handleChange}
            fullWidth
          />
        </div>
      )
    );
  };

  // const displayArtworkInfor = async () => {
  //   if (user?.userId) {
  //     try {
  //       const artworks = await GetArtsByCreatorId(user.userId);
  //       setArtworksByCreator(artworks);
  //     } catch (error) {
  //       console.error("Error fetching artworks by creator:", error);
  //     }
  //   }
  // };
  // Khởi tạo formik với giá trị ban đầu rỗng, sẽ được cập nhật sau khi load dữ liệu

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {
      artworkID: artworkID,
      creatorID: user?.userId, // ID người đăng bài
      artworkName: "",
      description: "",
      dateCreated: "",
      likes: 0,
      purchasable: false,
      price: 0,
      imageFile: "",
      artworkTag: [{}],
    },
    onSubmit: (values) => {
      const time = new Date();
      values.dateCreated = time.toISOString();
      if (preview) {
        values.imageFile = preview.split(",")[1];
      }
      // Cập nhật lại purchasable từ priceSwitch
      values.purchasable = priceSwitch;

      // Gọi API PUT để cập nhật artwork
      const updateArtwork = async () => {
        try {
          const response = await axios.put(url, values);
          console.log("Update Artwork Complete! " + response.data);
          const updatedArtwork: Artwork = response.data;
          // Chuyển hướng về trang chi tiết artwork
          navigate(`../artwork/${updatedArtwork.artworkID}`);
        } catch (err) {
          console.error("Error updating artwork:", err);
        }
      };
      updateArtwork();
    },
    validationSchema: Yup.object({
      artworkName: Yup.string().required("NAME! I want a name! Please..."),
      description: Yup.string().required("What? Tell me more about your work."),
    }),
  });

  // Load dữ liệu artwork cần cập nhật
  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const artworkData: Artwork = await GetArtById(id);
        console.log(artworkData);
        const tagList: tag[] = await GetTagByArtId(artworkData.artworkID);
        console.log(tagList);
        // Nếu có imageFile, chuyển thành Data URL để xem trước
        if (artworkData.imageFile) {
          setPreview(`${artworkData.imageFile}`);
        }
        const artworkTagsFromBE = (artworkData.artworkTag || tagList).map(tag => ({
          ...tag,
          tagID: tag.tagID ?? tag.tagId, // Giữ nguyên tagID nếu có
          tagName:
              tag.tagName ||
              listOfTags.find(t => t.tagId === tag.tagID || t.tagID === tag.tagID)?.tagName ||
              "Unknown Tag", // Tìm tên tag từ danh sách có sẵn
          artworkID: artworkData.artworkID,
        }));
        // Cập nhật giá trị priceSwitch và formik
        setPriceSwitch(artworkData.purchasable);
        formik.setValues({
          artworkID: artworkData.artworkID,
          creatorID: user.userId,
          artworkName: artworkData.artworkName,
          description: artworkData.description,
          dateCreated: artworkData.dateCreated,
          likes: artworkData.likes,
          purchasable: artworkData.purchasable,
          price: artworkData.price,
          imageFile: artworkData.imageFile,
          // artworkTag: tagList || [],
          artworkTag : artworkTagsFromBE,

          // Không load hình ảnh trực tiếp, sẽ load qua preview\n          artworkTag: artworkData.artworkTag || [],
        });
      } catch (error) {
        console.error("Error fetching artwork:", error);
      }
    };
    fetchArtwork();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <div
      className="formup"
      style={{
        backgroundImage: "url('/images/desk.jpg')",
        backgroundSize: "cover",
      }}
    >
      <div
        className="userInfoForm"
        style={{ backgroundColor: `rgba(${theme.rgbBackgroundColor},0.80)` }}
      >
        <form onSubmit={formik.handleSubmit}>
          <CustomizedTypography variant="h4" component="h2" gutterBottom>
            Update Your Artwork
          </CustomizedTypography>
          <div className="allFieldForm">
            <Box
              className="textFieldBox"
              sx={{
                width: "50%",
                backgroundColor: theme.backgroundColor,
                padding: "2%",
                border: `solid 1px ${theme.color}`,
                borderRadius: "5px",
              }}
            >
              <div className="artTextField" style={{ marginBottom: "2%" }}>
                <CustomizedTextField
                  name="artworkName"
                  label="Give Your Amazing Art A Name"
                  value={formik.values.artworkName}
                  onChange={formik.handleChange}
                  fullWidth
                />
                {formik.errors.artworkName && (
                  <Typography variant="body2" color="red">
                    {formik.errors.artworkName}
                  </Typography>
                )}
              </div>
              <div className="artTextField">
                <CustomizedTextField
                  name="description"
                  label="Description Of Your Art"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  multiline
                  fullWidth
                  rows={4}
                />
                {formik.errors.description && (
                  <Typography variant="body2" color="red">
                    {formik.errors.description}
                  </Typography>
                )}
              </div>
            </Box>
            <Box
              className="priceBox"
              sx={{
                backgroundColor: theme.backgroundColor,
                borderColor: theme.color,
              }}
            >
              <FormControlLabel
                sx={{ color: theme.color, marginBottom: "10%" }}
                control={
                  <CustomizedSwitch
                    checked={priceSwitch}
                    onChange={(event) => handleSwitchChange(event)}
                    name="purchasable"
                  />
                }
                label="Is Purchasable?"
              />
              {handlePriceVisibility()}
            </Box>
          </div>
          <Box className="tagAndpreviewBox">
            {listOfTags?.length !== 0 ? (
              <FormikProvider value={formik}>
                <div
                  className="tagField"
                  style={{
                    backgroundColor: theme.backgroundColor,
                    border: `solid 1px ${theme.color}`,
                    padding: "2%",
                    borderRadius: "5px",
                  }}
                >
                  <FieldArray
                    name="artworkTag"
                    render={(arrayHelpers) => (
                      <>
                        <Autocomplete
                          options={(listOfTags || []).filter(
                            (option) =>
                              !formik.values.artworkTag.some(
                                (tag) =>
                                  tag.tagID === (option.tagId || option.tagID)
                              )
                          )}
                          getOptionLabel={(option) => option.tagName}
                          isOptionEqualToValue={(option, value) =>
                            option.tagId === value.tagId ||
                            option.tagID === value.tagID
                          }
                          onChange={(event, value) => {
                            if (value) {
                              const newTag = {
                                artworkTagID: 0,
                                artworkID: formik.values.artworkID || 0,
                                tagID: value.tagId || value.tagID,
                                tagName: value.tagName, // thêm tagName để lưu đầy đủ thông tin
                              };
                              arrayHelpers.push(newTag);
                              console.log("Selected tag:", value);
                              console.log(
                                "Current artworkTag array:",
                                formik.values.artworkTag
                              );
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Tag"
                              variant="outlined"
                              style={{
                                color: theme.color,
                                marginBottom: "2%",
                                border: `1px solid ${theme.color}`,
                                borderRadius: "5px",
                              }}
                              InputLabelProps={{
                                style: { color: theme.color },
                              }}
                              InputProps={{
                                ...params.InputProps,
                                style: { color: theme.color3 },
                              }}
                            />
                          )}
                        />
                        <div className="tagChips">
                          {formik.values.artworkTag.map((tag, index) => {
                            const label =
                              tag.tagName ||
                              listOfTags?.find(
                                (t) =>
                                  t.tagId === tag.tagID || t.tagID === tag.tagID
                              )?.tagName ||
                              "Unknown Tag";
                            console.log("Rendering chip for tag:", label);
                            return (
                              <Chip
                                key={index}
                                label={label}
                                onDelete={() => arrayHelpers.remove(index)}
                                style={{
                                  margin: "4px",
                                  border: `1px solid ${theme.color}`,
                                  backgroundColor: theme.backgroundColor,
                                  color: theme.color,
                                  boxShadow: `0 0 5px ${theme.color}`,
                                }}
                              />
                            );
                          })}
                        </div>
                      </>
                    )}
                  />
                </div>
              </FormikProvider>
            ) : (
              ""
            )}
            <div className="imageBox">
              <Typography
                variant="h6"
                color={theme.color}
                sx={{ textAlign: "right" }}
              >
                Preview Image
              </Typography>
              <img
                style={{
                  border: `solid 1px ${theme.color}`,
                  backgroundColor: theme.backgroundColor,
                }}
                className="previewImage"
                src={preview}
                alt="Preview Here!"
              />
            </div>
          </Box>
          <CustomizedButton
            sx={{
              display: "block",
              width: "50%",
              margin: "auto",
              marginTop: "5vh",
            }}
            variant="contained"
            type="submit"
          >
            Update Artwork
          </CustomizedButton>
        </form>
      </div>
    </div>
  );
}

export default UpdateArtwork;
