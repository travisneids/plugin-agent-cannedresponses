import React from 'react'
import { Actions, withTheme } from '@twilio/flex-ui'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import FormHelperText from '@material-ui/core/FormHelperText'
import MenuItem from '@material-ui/core/MenuItem'
import { withTaskContext } from '@twilio/flex-ui'

class CannedResponsesComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      response: '',
    }
  }

  handleChange = async (event) => {
    this.setState({ [event.target.name]: event.target.value })

    switch (event.target.value) {
      case 'owlshoes-video-chat':
        const { sid } = this.props.task
        const {
          crmid,
          activeCrmId,
          activeCrmProvider,
          name,
          flexWorker,
          from,
          email,
        } = this.props.task.attributes

        const videoUrl = encodeURI(
          process.env.REACT_APP_OWL_SHOES_VIDEO_CHAT_URL +
            `?worker=${encodeURIComponent(
              flexWorker,
            )}&crmid=${encodeURIComponent(
              crmid,
            )}&activeCrmId=${encodeURIComponent(
              activeCrmId,
            )}&crmProvider=${encodeURIComponent(
              activeCrmProvider,
            )}&customer=${encodeURIComponent(
              name,
            )}&insightsSid=${encodeURIComponent(
              sid,
            )}&phoneNumber=${encodeURIComponent(
              from,
            )}&email=${encodeURIComponent(email)}`,
        )

        await this.updateTaskWithConversationId()

        Actions.invokeAction('SendMessage', {
          channelSid: this.props.channelSid,
          body: `Please join this video chat: ${videoUrl}`,
        })

        break
      case 'owlbank-video-chat':
        await this.updateTaskWithConversationId()
        Actions.invokeAction('VideoChat', {
          origin: 'cannedResponses',
        }).then((payload) => {
          const { videoUrl } = payload
          Actions.invokeAction('SendMessage', {
            channelSid: this.props.channelSid,
            body: `Please join this secure video chat: ${videoUrl}`,
          })
        })
        break
      default:
        Actions.invokeAction('SendMessage', {
          channelSid: this.props.channelSid,
          body: event.target.value,
        })
    }
  }

  // add my taskSid as conversation_id to tie together this digital task to new video task
  updateTaskWithConversationId = async () => {
    const { task } = this.props
    const attributes = { ...task.attributes }
    if (attributes.conversations) {
      attributes.conversations.conversation_id = task.sid
    } else {
      attributes.conversations = {
        conversation_id: task.sid,
      }
    }
    task.setAttributes(attributes)
  }

  render() {
    let layout = null
    if (!this.props.task || !this.props.task.attributes) {
      return null
    }
    const { attributes } = this.props.task

    switch (attributes.demoType) {
      case 'owlshoes':
        layout = (
          <React.Fragment>
            <FormControl className="form" style={styles.formControl}>
              <FormHelperText style={styles.inputLabel}>
                Canned Responses
              </FormHelperText>
              <Select
                value={this.state.response}
                onChange={this.handleChange}
                name="response"
              >
                <MenuItem value="One moment while I check on that.">
                  Please Hold
                </MenuItem>
                <MenuItem value="We are running a buy one get one 25% off promotion - use BUYMORE.">
                  Promotion
                </MenuItem>
                <MenuItem value="Is there anything else I can help with?">
                  Anything Else
                </MenuItem>
                <MenuItem value="Thank you for being a valued Owl Shoes customer.">
                  Valued Customer
                </MenuItem>
                <MenuItem value="Our store hours are Monday - Saturday 10am - 9pm, Sunday 10am - 5pm.">
                  Store Hours
                </MenuItem>
                <MenuItem value="owlshoes-video-chat">
                  Start Video Chat
                </MenuItem>
              </Select>
            </FormControl>
          </React.Fragment>
        )

        break

      case 'owlbank':
        layout = (
          <React.Fragment>
            <FormControl className="form" style={styles.formControl}>
              <FormHelperText style={styles.inputLabel}>
                Canned Responses
              </FormHelperText>
              <Select
                value={this.state.response}
                onChange={this.handleChange}
                name="response"
              >
                <MenuItem value="One moment while I check on that.">
                  Please Hold
                </MenuItem>
                <MenuItem value="Thank you for being a valued customer.">
                  Valued Customer
                </MenuItem>
                <MenuItem value="Is there anything else I can assist you with?">
                  Anything Else
                </MenuItem>
                <MenuItem
                  value={encodeURI(
                    process.env.REACT_APP_INVESTOR_RELATIONS_URL,
                  )}
                >
                  Send Investment Outlook
                </MenuItem>
                <MenuItem value="owlbank-video-chat">
                  Send Video Chat Invite
                </MenuItem>
              </Select>
            </FormControl>
          </React.Fragment>
        )

        break

      default:
        layout = (
          <React.Fragment>
            <FormControl className="form" style={styles.formControl}>
              <FormHelperText style={styles.inputLabel}>
                Canned Responses
              </FormHelperText>
              <Select
                value={this.state.response}
                onChange={this.handleChange}
                name="response"
              >
                <MenuItem value="One moment while I check on that.">
                  Please Hold
                </MenuItem>
                <MenuItem value="Thank you for being a valued customer.">
                  Valued Customer
                </MenuItem>
                <MenuItem value="Is there anything else I can assist you with?">
                  Anything Else
                </MenuItem>
              </Select>
            </FormControl>
          </React.Fragment>
        )
    }

    return layout
  }
}

const styles = {
  formControl: {
    width: '100%',
    marginBottom: '20px',
  },
  inputLabel: {
    paddingLeft: '5px',
  },
}

export default withTheme(withTaskContext(CannedResponsesComponent))
