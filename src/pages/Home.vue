<template>
  <div style="padding: 50px;">
    <h3>Population trends</h3>
    <img src="demographer.gif" />
    <div><b>Hello!</b> I'm Erkan, your virtual demo grapher assistant!</div>
    <div>I would like to show you the recent statistics around births, deaths, diseases or marriages in a population.</div>
    <br>
    <div v-if="conversationContextPrompt.length <=1">Just give me some time to prepare.....</div>
    <div v-if="conversationContextPrompt.length >1">
      <div><strong>Which country you want to get statistics from?</strong></div>
      <div><input type="text" v-debounce:1000ms="addMessage"/></div>
    </div>
    <br>

    <div v-if="conversationContextPrompt.length>3">
      <BarChart :chartData="birthsData" /><br><br>
      <BarChart :chartData="deathsData" />
    </div>

  </div>
</template>

<script setup>
  import { ref, onMounted, toRaw } from 'vue'
  import { BarChart } from 'vue-chart-3';
  import { Chart, registerables } from "chart.js";
  Chart.register(...registerables);
  const conversationContextPrompt = ref('')
  const assistantResult = ref('');
  conversationContextPrompt.value = [{ role: 'system', content: 'You are a demographer and your name is Erkan.'}]
  const birthsData = ref('');
  const deathsData = ref('');


  onMounted(() => {
    getStatistics();
  })

  const getStatistics = async (user) => {
    const response = await fetch('http://localhost:3000/analyse', {
      method: 'POST', // GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors,cors, same-origin
      cache: 'no-cache', // default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include,same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, follow, error
      referrerPolicy: 'no-referrer', // no-referrer,no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({ messages: conversationContextPrompt.value }) // body data type must match "Content-Type" header
    })

    assistantResult.value = await response.json();
    if(user) {
      assistantResult.value = JSON.parse(assistantResult.value);

      birthsData.value = {
      labels: ['2011', '2012', '2013', '2014', '2015', '2015', '2016', '2017', '2018', '2019'],
      datasets: [
        {
          label: 'Births',
          data: toRaw(assistantResult.value).births,
          backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED', '#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
        },
      ],
      };
      deathsData.value = {
      labels: ['2011', '2012', '2013', '2014', '2015', '2015', '2016', '2017', '2018', '2019'],
      datasets: [
        {
          label: 'Deaths',
          data: toRaw(assistantResult.value).deaths,
          backgroundColor: ['#880808', '#AA4A44', '#EE4B2B', '#A52A2A', '#800020', '#6E260E', '#CC5500', '#E97451', '#D22B2B', '#C41E3A'],
        },
      ],
      };
    }
    conversationContextPrompt.value = [...conversationContextPrompt.value, {role: 'assistant', content: assistantResult}]
  }

  function addMessage(country) {
    assistantResult.value = '';
    conversationContextPrompt.value = [...conversationContextPrompt.value, 
      {
        role: 'user', 
        content: 'Give me the statistics, which is not realtime, of around births or deaths between 2011 and 2020 for the country ' + country + 
        ' only in a RFC 8259 valid json format starting with the key value pair births and deaths. The value of each should be a array of numbers without any comments.',
      },
    ],
    getStatistics('user');
  }

</script>


<style lang="scss" scoped>
input {
  height: 50px;
  font-size: 40px;
}
</style>