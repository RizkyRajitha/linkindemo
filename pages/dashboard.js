// import styles from "../styles/dashboard.module.css";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { getPageData } from "../lib/dbfunc";
import { cookieValidate } from "../middleware/middleware";

import styles from "../styles/dashboard.module.css";
import Home from "./homeview";

const endpoint =
  process.env.NODE_ENV === "production"
    ? `${window.location.origin}`
    : "http://localhost:3000";

export async function getServerSideProps({ req, res }) {
  try {
    cookieValidate(req, res);
    let data = await getPageData();
    console.log(data);
    return { props: { data } };
  } catch (error) {
    return { props: { error } };
  }
}

const Admin = ({ data }) => {
  const [showmsg, setshowmsg] = useState("");
  const [loading, setloading] = useState(false);
  const [pageData, setpageData] = useState(data);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ defaultValues: data });

  // watch((data, { name, type }) => {
  //   console.log(data, name, type);

  //   let prePageData = { ...pageData };

  //   let keys = Object.keys(data);

  //   keys.map((x) => {
  //     prePageData[x] = data[x];
  //   });

  //   setpageData(prePageData);
  // });

  // const watchAllFields = watch();

  // useEffect(() => {
  // let prePageData = { ...pageData };

  // let keys = Object.keys(watchAllFields);

  // keys.map((x) => {
  //   prePageData[x] = watchAllFields[x];
  // });

  // setpageData(prePageData);
  // }, [watchAllFields]);

  // useWatch();

  // form;

  const save = async (data) => {
    console.log(data);
    let prePageData = { ...pageData };

    let keys = Object.keys(data);

    keys.map((item) => {
      prePageData[item] = data[item];
    });

    console.log(prePageData);

    try {
      let res = await fetch(`${endpoint}/api/updatepagedata`, {
        method: "POST",
        body: JSON.stringify(prePageData),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json());

      if (!res.success) {
        setloading(false);

        if (res.message === "invalid_credential") {
          setshowmsg("User creadentials are not valid");
        } else {
          setshowmsg("Server Error");
        }
        return;
      }
      setloading(false);

      console.log(res);
      setpageData(res.updatedPageData);
    } catch (error) {
      setloading(false);
      console.log(error);
      setshowmsg("Server Error " + error.message);
    }
  };

  const login = async (data) => {
    setloading(true);
    console.log(data);
    setshowmsg("");
    let payload = {
      username: data.username,
      password: data.password,
    };
    console.log(payload);
  };

  return (
    <>
      <div className="d-flex">
        <div className={styles.Wrapper}>
          <div
            className={`${styles.Inner} col-10 col-sm-8 col-md-8 col-lg-6 col-xl-6 col-xxl-6 `}
          >
            <div hidden={!showmsg} className="alert alert-danger">
              {showmsg}
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <h3>Edit</h3>
              <div className="mb-3 ">
                <label className="form-label">Handler name</label>
                <input
                  type="text"
                  className={
                    errors.handlerText
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  placeholder="Enter Handler name"
                  {...register("handlerText")}
                />
                {/* {errors.handlerText && (
                  <div className="invalid-feedback">
                    {errors.handlerText.message}
                  </div>
                )} */}
              </div>
              <div className="mb-3 ">
                <label className="form-label">Handler link</label>
                <input
                  type="text"
                  className={
                    errors.handlerlink
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  placeholder="Enter Handler link"
                  {...register("handlerlink")}
                />
                <div className="form-text">
                  Ex - https://www.instagram.com/wonderousnightsky/
                </div>

                {errors.handlerlink && (
                  <div className="invalid-feedback">
                    {errors.handlerlink.message}
                  </div>
                )}
              </div>{" "}
              <div className="mb-3 ">
                <label className="form-label">Footer text</label>
                <input
                  type="text"
                  className={
                    errors.footerText
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  placeholder="Enter Footer text"
                  {...register("footerText")}
                />
              </div>{" "}
              <div className="mb-3 ">
                <label className="form-label">Background color</label>

                <input
                  type="color"
                  className="form-control form-control-color"
                  // value="#563d7c"
                  title="Choose Background color"
                  {...register("bgColor")}
                />

                {/* <input
                  type="text"
                  className={
                    errors.bgColor ? "form-control is-invalid" : "form-control"
                  }
                  placeholder="Enter Background color"
                  {...register("bgColor")}
                /> */}
              </div>{" "}
              <div className="mb-3 ">
                <label className="form-label">Accent color </label>
                <input
                  type="color"
                  className="form-control form-control-color"
                  // value="#563d7c"
                  title="Choose Accent color"
                  {...register("accentColor")}
                />
              </div>{" "}
              <div className="mb-3 ">
                <label className="form-label">Avatar Url</label>
                <input
                  type="text"
                  className={
                    errors.avatarUrl
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  placeholder="Enter Avatar Url"
                  {...register("avatarUrl")}
                />
                <div className="form-text">
                  square images are better. (
                  <a href="https://imgur.com/" target="_blank">
                    imgur
                  </a>{" "}
                  is preferd)
                </div>
              </div>{" "}
              {/* <div className="mb-3 ">
                <label className="form-label">Handler name</label>
                <input
                  type="text"
                  className={
                    errors.handlername
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  placeholder="Enter Handler name"
                  {...register("handlername")}
                />
              </div> */}
              {/* <button class="btn btn-primary" type="button" disabled>
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </button> */}
              <button
                type="submit"
                className="btn btn-primary btn-block"
                onClick={handleSubmit(save)}
                // disabled={loading}
              >
                {/* {loading && (
                  <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )} */}
                Save
              </button>
              {/* <p className="forgot-password text-right">
            Forgot <a href="#">password?</a>
          </p> */}
            </form>
          </div>
        </div>
        <div className={styles.Wrapper}>
          <Home {...pageData} />
        </div>
      </div>
    </>
  );
};
export default Admin;
