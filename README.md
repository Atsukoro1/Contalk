<div id="top"></div>
<br />
<div align="center">
  <a>
    <img src="https://i.postimg.cc/hjW5Fwd0/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Contalk</h3>

  <p align="center">
    A simple chat application
    <br />
    <a href="www.example.cz"><strong>Explore the docs (soon) »</strong></a>
    <br />
    ·
    <a href="https://github.com/Atsukoro1/Contalk/issues">Report Bug</a>
    ·
    <a href="https://github.com/Atsukoro1/Contalk/issues">Request Feature</a>
  </p>
</div>

## Note
* This project was intended to be for school final exams, it is not meant to be used for production!

## About The Project

Why i made this project:
* I wanted to make chat application that will bring people together
* Because people want some app that does not collect aditionall data, that are used for advertising purposes. Instead Contalk only collects what it needs to make sure the application will run correctly.

### Built With

This section lists all the frameworks, libraries and other technologies that were used to bootstrap this project. Thanks to all of them!

* [Fastify](https://www.fastify.io/)
* [Mongoose](https://mongoosejs.com/)
* [Socket.io](https://socket.io/)
* [Node.js](https://nodejs.org/en/)
* [Axios](https://www.npmjs.com/package/axios)
* [Next.js](https://nextjs.org/)
* [Framer-motion](https://www.framer.com/motion/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

This sections contains all required information that will you need to install all the required dependencies and run to run the application correctly.

### Installation
Firstly, clone the repo from the official Contalk Github repository
1. Clone the repo
   ```sh
   git clone https://github.com/Atsukoro1/Contalk
   ```

2. Install required libraries and tools
You will need Yarn or Npm to install all the required packages listed in package.json, it is not not required
to install dependencies from client and server repository independently. You can use lerna to do this automatically
for you.

* To install Npm go to the [Node.js page](https://nodejs.org/en/) and complete installation for the LTS version

Now install all required packages for server and client directory using:
```sh
npx lerna bootstrap
```

And the last thing you need is typescript, it will be used to transpile all typescript files to clear javascript,
install typescript with this command
```sh
npm install --location=global typescript
```

3. Building and running
* Building and starting applications using Lerna
  ```sh
  npx lerna run build

  ... and then start it with

  npx lerna run start
  ```

<p align="right">(<a href="#top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>
