document.addEventListener("DOMContentLoaded", function () {

  const addToCartButtons = document.querySelectorAll('button[type="button"]');
  const cartTable = document.querySelector('#cart-table');
  const totalElement = document.querySelector('#total');
  const taxElement = document.querySelector('#tax');
  let cartItems = [];
  let total = 0;
  let t = 0;
  window.addToCart = function () {
    if (!event.target) return;
    const productRow = event.target.closest('tr');
    const productName = productRow.querySelector('td:first-child').innerText;
    const productPriceElement = productRow.querySelector('td:nth-child(3)');
    const productPrice = productPriceElement ? parseInt(productPriceElement.innerText) || 0 : 0;
    const existingItem = cartItems.find(item => item.name === productName);

    if (existingItem) {
      existingItem.quantity++;
      const existingRow = cartTable.querySelector(`tr[data-name="${productName}"]`);
      const quantityCell = existingRow.querySelector('td:nth-child(4)');
      const subtotalCell = existingRow.querySelector('td:nth-child(5)');
      quantityCell.textContent = existingItem.quantity;
      subtotalCell.textContent = productPrice * existingItem.quantity;
    } else {
      // اضافة صنف جديد
      cartItems.push({
        name: productName,
        price: productPrice,
        quantity: 1
      });

      // انشاء صف في السلة
      const newRow = document.createElement('tr');
      newRow.dataset.name = productName;
      newRow.innerHTML = `
      <td>${cartItems.length}</td>
      <td>${productName}</td>
      <td>${productPrice}</td> 
      <td>1</td>
      <td>${productPrice}</td>
    `;
      const firstRow = document.getElementById('headercart');
      firstRow.parentNode.insertBefore(newRow, firstRow.nextSibling);
    }
    total += productPrice;
    const tax = total * 0.05;
    const grandTotal = total - tax;
    t = grandTotal;
    totalElement.textContent = `فقط ${numberToTextArabic(grandTotal)} لا غير`;
    taxElement.textContent = `${tax} ل.س`;
    document.querySelector('#grand-total').textContent = `${grandTotal} ل.س`;
  };


  function numberToTextArabic(number) {
    const units = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
    const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
    const hundreds = ['', 'مئة', 'مئتان', 'ثلاثمئة', 'أربعمئة', 'خمسمئة', 'ستمئة', 'سبعمئة', 'ثمانمئة', 'تسعمئة'];
    const powersOfTen = ['', 'ألف', 'مليون', 'مليار'];

    if (number === 0) {
      return 'صفر';
    }

    function convertGroup(number) {
      const group = [];

      if (number >= 100) {
        group.push(hundreds[Math.floor(number / 100)]);
        number %= 100;
      }

      if (number >= 20) {
        group.push(tens[Math.floor(number / 10)]);
        number %= 10;
      }

      if (number > 0) {
        group.push(units[number]);
      }

      return group.join(' و ');
    }

    const parts = [];
    let power = 0;

    while (number > 0) {
      const group = number % 1000;
      if (group > 0) {
        const groupName = convertGroup(group);
        const powerName = powersOfTen[power];
        parts.unshift(groupName + ' ' + powerName);
      }
      number = Math.floor(number / 1000);
      power++;
    }

    return parts.join(' و ');
  }


  window.resetCartTable = function () {
    const rows = document.querySelectorAll('#cart-table tr:not(#headercart)');
    const numRows = rows.length;
    cartItems = [];
    if (numRows > 3) {
      for (let i = 0; i < numRows - 4; i++) {
        rows[i].remove();
      }
    }
    total = 0;
    const tax = 0;
    totalElement.textContent = 'فقط 0 لا غير';
    taxElement.textContent = '0 ل.س';
    document.querySelector('#grand-total').textContent = '0 ل.س';
  }

  window.toggleForm = function () {
    const form = document.querySelector('#myForm');
    const button = document.querySelector('#toggleButton');
    if (cartItems.length != 0) {
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
    } else {
      alert("أضف  إلى السلة ");

    }
    //توليد كود كابتشا عشوائي
  }
  window.generateCaptcha = function () {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const captchaCode = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const captchaImgEl = document.getElementById('captchaImg');
    if (captchaImgEl) {
      captchaImgEl.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="30" viewBox="0 0 100 30" preserveAspectRatio="none">
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="black">${captchaCode}</text>
      </svg>`);
      captchaImgEl.alt = captchaCode; // تعين رمز التحقق
    }
  }
  
  function checkCaptcha() {
    const captchaInputEl = document.getElementById("txtCompare");
    const captchaImgEl = document.getElementById('captchaImg');
  
    if (captchaInputEl.value.toLowerCase() === captchaImgEl.alt.toLowerCase()) {
      return true;
    } else {
      return false;
    }
  }
  
  generateCaptcha();
  
  window.validateForm = function () {
    var email = document.getElementById("email").value;
    var number_s = document.getElementById("number_s").value;
    var date1 = document.getElementById("birth-date").value;
    var phone = document.getElementById("phonenumber").value;
    var txtCompare = document.getElementById("txtCompare").value;
    var username = document.getElementById("myUsername").value;
  //الحقول الاجبارية
    if (username == "" || email == "" || number_s == "" || date1 == "" || phone == "") {
      alert("يرجى تعبيئة الحقول ");
      return false;
    }
  //حقل الاسم
    var usernamePattern = /^[\u0600-\u06FF\s]+$/;
    if (!usernamePattern.test(username)) {
      alert(" إدخل الاسم باللغة العربية فقط!! ");
      return false;
    }
  //حقل البريد الالكتروني
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("ادخل عنوان بريد إلكتروني صالح");
      return false;
    }
  // حقل رقم البطاقة الشخصية
    var numberPattern = /^(0[1-9]|1[0-5])[0-9]{9}$/;
    if (!numberPattern.test(number_s)) {
      alert(" إدخل رقم وطني  بين 01 و 15");
      return false;
    }
  //حقل تاريخ الميلاد
    var datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    if (!datePattern.test(date1)) {
      alert(" إدخل تاريخ ميلاد صالح DD/MM/YYYY");
      return false;
    }
  //حقل الموبايل
    var phonePattern = /((0)(93|94|95|96|98|99)([0-9]{7}))|((0)(92|95|96|97)([0-9]{7}))/;
    if (!phonePattern.test(phone)) {
      alert(" إدخل رقم هاتف يعمل (مثال: 0911111111)");
      return false;
    }
  // حقل كتابة كود الكابتسا
    if (!checkCaptcha()) {
      alert(" إدخل كود التحقق");
      return false;
    }
  
    alert(" شكرا تم تقديم الطلب بنجاح !! \n  الحساب الكامل    " + t + "ل.س");
    return true;
  }
  
    var appliances =
     [
      
      {
        name: "براد كهربائي",
        details: "براد كهربائي قوي وفعال مع فريز ذو قدرة جيدة للتجميدالمنزل",
        price: "650000 ل.س",
        image: "images/1.png",
      },
      {
        name: "غسالة ملابس",
        details: "غسالة ملابس ذات سعة كبيرة وبرامج متعددة",
        price: "850000 ل.س",
        image: "images/2.png",
      },
      {
        name: "فرن غاز كهربائي",
        details: "فرن غاز بتقنيات حديثة وسعة تخزين واسعة",
        price: "1216000 ل.س",
        image: "images//3.png",
      },
      {
        name: " مايكرويف",
        details: "مايكرويف ديجتال بقوة حرارة عالية ووظائف متنوعة",
        price: "930000 ل.س",
        image: "images/4.png",
      },
      {
        name: " مكنسة كهربائية",
        details: "مكنسة كهربائية بتصميم أنيق  متعددة سرعات التنظيف",
        price: "280000 ل.س",
        image: "images/5.png",
      },
      {
        name: "طنجرة ضغط كهربائية",
        details: "طنجرةضغط كهربائية سريعة وآمنة لطهي الطعام",
        price: "70000 ل.س",
        image: "images/6.png",
      },
      {
        name: "تلفاز مسطح",
        details: "تلفاز مسطح ومتعدد الالوان يصل الى دقة 4K",
        price: "255000 ل.س",
        image: "images/7.png",
      },
      {
        name: "ميكف غاز",
        details: "مكيف كهربائي بتقنية حديثة وجهاز تحكم متعدد المهام صيفي شتوي",
        price: "850000 ل.س",
        image: "images/8.jpg",
      },
      {
        name: " خلاط",
        details: "خلاط كهربائية بتقنيات وسرعات مختلفة وسهولة الاستخدام",
        price: "130000 ل.س",
        image: "images/9.jpg",
      },
      {
        name: "جلاية ",
        details: "جلاية كهربائية قوية ومتعددة الوظائف للتنظيف والجلي والتنشيف",
        price: "650000 ل.س",
        image: "images/10.jpg",
      },
      
    ]
    
fillTable();
  function fillTable() {
    var table = document.getElementById("pTable");
    var tableHTML = "";
    for (var i = 0; i < appliances.length; i++) {
      tableHTML += "<tr>";
      tableHTML += "<td>" + appliances[i].name + "</td>";
      tableHTML += "<td>" + appliances[i].details + "</td>";
      tableHTML += "<td>" + appliances[i].price + "</td>";
      tableHTML +=
        '<td><img src="' +
        appliances[i].image +
        '" alt="' +
        (i + 1) +
        '" class="productImage"><br><br>';
      tableHTML +=
        '<button type="button" name="submit" onclick="addToCart(' +
        (i + 1) +
        ')">أضف إلى السلة</button></td>';
      tableHTML += "</tr>";
    }

    table.innerHTML = tableHTML;
  }
});

