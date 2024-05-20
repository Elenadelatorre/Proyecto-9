const puppeteer = require('puppeteer');
const fs = require('fs');
const { connectDB } = require('../config/db');

const laptopsArray = [];

//! Crear una función para iniciar el "scrapper" y realizar el ejercicio completo:
const scrapperProducts = async (url) => {
  await connectDB();

  return new Promise(async (resolve, reject) => {
    try {
      console.log(url);

      //Abrir instancia del navegador:
      const browser = await puppeteer.launch({ headless: false });
      //Abrir una nueva pagína:
      const page = await browser.newPage();
      //Esperar a que la navegación se complete (a la url que queremos) antes de seguir:
      await page.goto(url);
      //Esperar hasta que esté el siguiente selector (Cookies):
      await page.waitForSelector('.sc-jsJBEP');

      //Hacer la click en el botón "Rechazar todas" (si está):
      const button = await page.$('#cookiesrejectAll', (el) => el.click());
      if (button) {
        await button.click();
      }

      //Hacer la click en la cruz del modal (si está):
      const svg = await page.$(
        '.cn_content_close-b7acdf70-2fa5-40a6-86e1-cefb903c2704',
        (el) => el.click()
      );
      if (svg) {
        await svg.click();
      }
      //Configurar el tamaño de la ventana gráfica del navegador:
      await page.setViewport({ width: 1080, height: 1024 });
      //Acceder a los datos de la página y repetir la acción hasta que no haya más productos:
      await repeat(page, browser);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

//! Crear una función asíncrona para repetir la navegación hasta que no haya más productos:
const repeat = async (page, browser) => {
  //Seleccionar todos los elementos que quiero:
  const arrayDivs = await page.$$('.product-card');

  //Recorrer cada producto:
  for (const laptopDiv of arrayDivs) {
    //title:
    let title = await laptopDiv.$eval(
      '.product-card__title',
      (el) => el.textContent
    );
    //img:
    let img = await laptopDiv.$eval('img', (el) => el.src);
    //price:
    let price = await laptopDiv.$eval('.product-card__price-container', (el) =>
      parseFloat(el.textContent.slice(0, el.textContent.length - 1))
    );
    //Unir los elementos de cada producto:
    let laptop = { title, img, price };

    //Añadir al array si no están duplicados:
    if (!laptopsArray.some((g) => g.title === laptop.title)) {
      laptopsArray.push(laptop);
    }
  }

  //* Seleccionar la flecha para que vaya a la siguiente página de juegos:
  try {
    //Hacer click en la flecha de siguiente (si está):
    await page.$eval("[aria-label='Página siguiente']", (el) => el.click());
    //Esperar a que complete la navegación por la página:
    await page.waitForNavigation();
    console.log('Pasamos a la siguiente página');
    console.log(`Llevamos ${laptopsArray.length} datos recolectados`);

    //Repetir las navegaciones hasta que no haya más productos:
    await repeat(page, browser);
  } catch (error) {
    //Declarar la función "write":
    await writeFile();
    await browser.close();
  }
};
const writeFile = () => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      './products.json',
      JSON.stringify(laptopsArray, null, 2),
      (error) => {
        if (error) {
          reject(error);
        } else {
          console.log('Archivo creado');
          resolve();
        }
      }
    );
  });
};
module.exports = { scrapperProducts };
