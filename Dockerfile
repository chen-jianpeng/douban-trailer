FROM node
ENV NODE_ENV=production
ENV HOST 0.0.0.0
COPY . /douban-trailer
WORKDIR /douban-trailer
#If the environment in China build please open the following comments
#RUN npm config set registry https://registry.npm.taobao.org
RUN npm install
RUN npm run build
CMD ["npm", "start"]