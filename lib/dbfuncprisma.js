import Prisma from "../db/dbconprisma";

// bgColorList = [

// ];

// bgColorList = [
// "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80"
// ,"",""
// ];

let dataList = [
  {
    bgColor:
      "linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
    bgImgUrl: "",
    handlerFontColor: "#fff",
    handlerDescriptionFontColor: "#fff",
    footerBgColor: "",
  },
  {
    handlerFontColor: "#fff",
    handlerDescriptionFontColor: "#fff",
    bgColor: "#7ea2ff",
    bgImgUrl: "",
    footerBgColor: "#7ea2ff",
  },
  {
    handlerDescriptionFontColor: "#d53072",
    handlerFontColor: "#d53072",
    bgColor: "",
    bgImgUrl:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",

    footerBgColor: "",
  },
];

/**
 * get User by username
 * @param {*} username
 * @returns User
 */
export async function getUser(username = null) {
  if (username === null) {
    throw new Error("pass valid username");
  }
  try {
    let response = await Prisma.users.findUnique({
      where: { username },
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * get PageData
 * @returns {object} Pagedata
 */
export async function getPageData() {
  try {
    let pageDataResponse = await Prisma.pagedata.findMany();

    let { created_at, ...pageData } = pageDataResponse[0];

    return { pageData };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * get LinkData
 * @param {*} includeInactive
 * @returns
 */
export async function getLinkData(includeInactive = true) {
  try {
    let pageDataResponse = await Prisma.pagedata.findMany();

    let pageData = pageDataResponse[0];

    let whereCluase = includeInactive
      ? { pagedataid: pageData.id }
      : { pagedataid: pageData.id, active: true };

    let linkDataResponse = await Prisma.linkdata.findMany({
      orderBy: { orderIndex: "asc" },
      where: whereCluase,
    });

    let linkData = [];

    linkDataResponse.forEach((element, index) => {
      let { created_at, ...linkDataRows } = element;
      linkData.push(linkDataRows);
    });

    return { linkData };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * get SocialData
 * @param {*} includeInactive
 * @returns
 */
export async function getSocialData(includeInactive = true) {
  try {
    let pageDataResponse = await Prisma.pagedata.findMany();

    let pageData = pageDataResponse[0];

    let whereCluase = includeInactive
      ? { pagedataid: pageData.id }
      : { pagedataid: pageData.id, active: true };

    let socialDataResponse = await Prisma.socialdata.findMany({
      orderBy: { orderIndex: "asc" },
      where: whereCluase,
    });

    let socialData = [];

    socialDataResponse.forEach((element, index) => {
      let { created_at, ...socialDataRows } = element;
      socialData.push(socialDataRows);
    });

    return { socialData };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * get PageData with LinkData
 * @param {*} includeInactive
 * @returns
 * @deprecated // Now all APP uses getPageDatawLinkAndSocialData method
 */
export async function getPageDatawLinkData(includeInactive = true) {
  try {
    let pageData = await getPageData();
    let linkData = await getLinkData(includeInactive);

    return { ...pageData, ...linkData };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * get PageData with LinkData & SocialData
 * @param {*} includeInactive
 * @returns
 */
export async function getPageDatawLinkAndSocialData(includeInactive = true) {
  try {
    let pageData = await getPageData();
    let linkData = await getLinkData(includeInactive);
    let socialData = await getSocialData(includeInactive);

    return { ...pageData, ...linkData, ...socialData };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * update PageData
 * @param {*} data
 * @returns
 */
export async function updatePageData(data) {
  try {
    let updatedPageData = await Prisma.pagedata.update({
      where: { id: 1 },
      data,
    });

    return updatedPageData;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * insert PageLink
 * @param {*} data
 * @returns
 */
export async function insertPageLinks(data) {
  try {
    let insertLinksData = Prisma.linkdata.create({ data });

    return insertLinksData;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * insert SocialLink
 * @param {*} data
 * @returns
 */
export async function insertSocialLinks(data) {
  try {
    let insertSocialData = Prisma.socialdata.create({ data });

    return insertSocialData;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * update Link
 * @param {*} data
 * @returns
 */
export async function updateLink(data) {
  try {
    const { id, ...dataWOid } = data;

    let updatedLink = await Prisma.linkdata.update({
      data: dataWOid,
      where: { id },
    });

    return updatedLink;
  } catch (error) {
    // console.log(error);
    if (error.code === "P2025") {
      throw new Error(error.meta.cause);
    }
    throw new Error(error.message);
  }
}

/**
 * update Social Link
 * @param {*} data
 * @returns
 */
export async function updateSocialLink(data) {
  try {
    const { id, ...dataWOid } = data;

    let updatedLink = await Prisma.socialdata.update({
      data: dataWOid,
      where: { id },
    });

    return updatedLink;
  } catch (error) {
    // console.log(error);
    if (error.code === "P2025") {
      throw new Error(error.meta.cause);
    }
    throw new Error(error.message);
  }
}

/**
 * delete Link
 * @param {*} id
 * @returns
 */
export async function deleteLink({ id }) {
  if (id === null || id === undefined) {
    throw new Error("pass valid id");
  }
  try {
    let response = await Prisma.linkdata.delete({ where: { id } });

    return response;
  } catch (error) {
    // console.log(error);
    if (error.code === "P2025") {
      throw new Error(error.meta.cause);
    }
    throw new Error(error.message);
  }
}

/**
 * delete Social Link
 * @param {*} id
 * @returns
 */
export async function deleteSocialLink({ id }) {
  if (id === null || id === undefined) {
    throw new Error("pass valid id");
  }
  try {
    let response = await Prisma.socialdata.delete({ where: { id } });

    return response;
  } catch (error) {
    // console.log(error);
    if (error.code === "P2025") {
      throw new Error(error.meta.cause);
    }
    throw new Error(error.message);
  }
}

/**
 * update all links with common data
 * @param {*} data
 * @returns
 */
export async function updateCommonData(data) {
  try {
    await Prisma.linkdata.updateMany({ data: data });
  } catch (error) {
    // console.log(error);
    if (error.code === "P2025") {
      throw new Error(error.meta.cause);
    }
    throw new Error(error.message);
  }
}

/**
 * change Password
 * @param {*} param0
 * @returns
 */
export async function changePassword({ username, newhashedpassword }) {
  if (username === null || username === undefined) {
    throw new Error("pass valid username");
  }

  if (newhashedpassword === null || newhashedpassword === undefined) {
    throw new Error("pass valid newhashedpassword");
  }

  try {
    let { password, ...response } = await Prisma.users.update({
      data: { password: newhashedpassword },
      where: { username: username },
    });

    return response;
  } catch (error) {
    // console.log(error);
    if (error.code === "P2025") {
      throw new Error(error.meta.cause);
    }
    throw new Error(error.message);
  }
}

export async function revertData() {
  try {
    await Prisma.linkdata.deleteMany();
    await Prisma.pagedata.deleteMany();
    await Prisma.$executeRaw("ALTER SEQUENCE linkdata_id_seq RESTART WITH 1;");

    let rand = Math.floor((Math.random() * 100) % 3);
    let datarand = dataList[rand];

    await Prisma.pagedata.create({
      data: {
        id: 1,
        avatarUrl:
          "https://res.cloudinary.com/dijjqfsto/image/upload/v1621666671/linkin_logo_1_jcuvr3.png",
        avatarwidth: "34",
        bgColor: datarand.bgColor, //"#7ea2ff",
        accentColor: "#bdd7ff",
        handlerText: "LinkIn Demo",
        handlerLink: "https://github.com/RizkyRajitha/linkin",
        footerText: "Powered by Linkin",
        handlerFontSize: "20",
        handlerFontColor: datarand.handlerFontColor, //"#ffffff",
        footerBgColor: datarand.footerBgColor, //"#7ea2ff",
        footerTextColor: "#ffffff",
        handlerDescriptionFontColor: datarand.handlerDescriptionFontColor,
        footerTextSize: "12",
        handlerDescription:
          "Linkin is a customizable self hosted link tree platform",
        linktreeWidth: "400",
        linkPadding: "1.4",
        bgImgUrl: datarand.bgImgUrl,
        avatarBorderColor:
          "linear-gradient(0deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
      },
    });

    await Prisma.linkdata.createMany({
      data: [
        {
          pagedataid: 1,
          iconClass: "fab fa-github",
          displayText: "GitHub",
          linkUrl: "https://github.com/RizkyRajitha/linkin",
          bgColor: "#2C6BED",
          textColor: "#ffffff",
          borderRadius: "15",
          active: true,
        },
        {
          pagedataid: 1,
          iconClass: "fab fa-discord",
          displayText: "Discord community",
          linkUrl: "https://discord.gg/Jsmc5Dm9wg",
          bgColor: "#2C6BED",
          textColor: "#ffffff",
          borderRadius: "15",
          active: true,
        },
      ],
    });

    await Prisma.socialdata.createMany({
      data: [
        {
          pagedataid: 1,
          iconClass: "fab fa-github",
          linkUrl: "https://github.com/RizkyRajitha/linkin",
          bgColor: "#2C6BED",
          textColor: "#ffffff",
          borderRadius: "5",
          active: true,
        },
        {
          pagedataid: 1,
          iconClass: "fab fa-discord",
          linkUrl: "https://discord.gg/Jsmc5Dm9wg",
          bgColor: "#2C6BED",
          textColor: "#ffffff",
          borderRadius: "5",
          active: true,
        },
      ],
    });

    return;
  } catch (error) {
    console.log(error);
    // if (error.code === "P2025") {
    //   throw new Error(error.meta.cause);
    // }
    throw new Error(error.message);
  }
}
/**
 * reorder Links
 * @param {*} data
 * @returns
 */
export async function reorderLinks(data = []) {
  if (data.length < 1) {
    throw new Error("invalid data");
  }

  let promiseArr = [];

  try {
    data.forEach((link) => {
      promiseArr.push(
        Prisma.linkdata.update({
          where: { id: link.id },
          data: { orderIndex: link.orderIndex },
        })
      );
    });

    await Promise.all(promiseArr);
  } catch (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

/**
 * reorder Social Links
 * @param {*} data
 * @returns
 */
export async function reorderSocialLinks(data = []) {
  if (data.length < 1) {
    throw new Error("invalid data");
  }

  let promiseArr = [];

  try {
    data.forEach((link) => {
      promiseArr.push(
        Prisma.socialdata.update({
          where: { id: link.id },
          data: { orderIndex: link.orderIndex },
        })
      );
    });

    await Promise.all(promiseArr);
  } catch (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
