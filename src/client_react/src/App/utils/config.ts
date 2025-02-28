class Config {
  emit_tg_in_browser = true
  api = 'http://localhost:3000' + '/api'
  // api = window.location.origin + '/api'
  // staticApi = window.location.origin
}

export default new Config()