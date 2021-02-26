import { save } from '@/api/flowable'

const actions = {
  save({ commit }, bpmnInfo) {
    return new Promise((resolve, reject) => {
      save(bpmnInfo).then(response => {
        // const { data } = response

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  actions
}

